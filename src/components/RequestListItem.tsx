import { useAuthenticator } from '@aws-amplify/ui-react';
import {
  IonButton,
  IonButtons,
  IonCard,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonLabel,
  IonModal,
  IonNote,
  IonSpinner,
  IonTextarea,
  IonTitle,
  IonToggle,
  IonToolbar
} from '@ionic/react';
import { DataStore, Predictions } from 'aws-amplify';
import { checkmarkOutline, closeOutline, eyeOutline, saveOutline } from 'ionicons/icons';
import { useEffect, useRef, useState } from 'react';
import { AccessRequests } from '../models';
import './RequestListItem.css';

const RequestListItem: any = ({ item }: any) => {

  const { user } = useAuthenticator((context) => [context.user]);

  const [isActionOpen, setIsActionOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [reason, setReason] = useState<any>("");
  const [action, setAction] = useState<any>("");
  const [loading, setLoading] = useState(false);
  const [sentiment, setSentiment] = useState("");
  const [sentimentVariation, setSentimentVariation] = useState("");
  const [sentimentPercent, setSentimentPercent] = useState();
  const [isChecked, setIsChecked] = useState(false);
  const [isNonEnglish, setIsNonEnglish] = useState(false);
  const [translatedText, setTranslatedText] = useState("");

  const ionItemRef: any = useRef();

  let statusClass = "dot-pending";
  if (item.status) {
    if (item.status === "APPROVED") statusClass = "dot-approved";
    if (item.status === "REJECTED") statusClass = "dot-rejected";
  }

  const processRequest = async () => {
    /* Models in DataStore are immutable. To update a record you must use the copyOf function
    to apply updates to the item’s fields rather than mutating the instance directly */
    setLoading(true);
    const models = await DataStore.query(AccessRequests, ar => ar.id.eq(item.id));
    const CURRENT_ITEM = models && models[0];
    if (CURRENT_ITEM) {
      const newData = await DataStore.save(AccessRequests.copyOf(CURRENT_ITEM, record => {
        // Update the values on {item} variable to update DataStore entry
        record.approverusername = user && user.username;
        record.approverreason = reason;
        record.status = action;
      }));
      item.approverusername = user && user.username;
      item.approverreason = reason;
      item.status = action;
      console.table(newData)
    }
    setLoading(false);
    setIsActionOpen(false);
  }

  const getSentimentPrediction = async (textToInterpret: any) => {
    const txt: any = {
      text: {
        source: {
          text: textToInterpret,
        },
        type: 'ALL'
      }
    }

    const sentiment = await Predictions.interpret(txt);
    return sentiment.textInterpretation.sentiment;
  }

  const captureSentiment = async (text: any) => {
    const result = text && await getSentimentPrediction(text);
    setSentiment(result.predominant);
    if (result.predominant === "NEUTRAL") { setSentimentPercent(result.neutral); setSentimentVariation("secondary"); }
    if (result.predominant === "POSITIVE") { setSentimentPercent(result.positive); setSentimentVariation("success"); }
    if (result.predominant === "NEGATIVE") { setSentimentPercent(result.negative); setSentimentVariation("danger"); }
  }

  const textTranslation = async (textToTranslate: any) => {
    const result = await Predictions.convert({
      translateText: {
        source: {
          text: textToTranslate,
          language: "auto" // defaults configured on aws-exports.js
          // supported languages https://docs.aws.amazon.com/translate/latest/dg/how-it-works.html#how-it-works-language-codes
        },
        targetLanguage: "en"
      }
    });
    return result;
  }

  const checkTranslationRequirement = async (text: any) => {
    const result = text && await textTranslation(text);
    if (result) {
      setIsNonEnglish(text !== result.text);
      setTranslatedText(result.text);
    }
  }

  useEffect(() => {
    captureSentiment(item.reason)
    checkTranslationRequirement(item.reason);
  }, []);

  return (
    <IonItemSliding ref={ionItemRef}>
      {!item.status &&
        <>
          <IonItemOptions side="start">
            <IonItemOption color="danger" onClick={() => { ionItemRef && ionItemRef.current.closeOpened(); setAction("REJECTED"); setIsActionOpen(true) }}>
              <IonIcon slot="start" icon={closeOutline}></IonIcon>
              Reject
            </IonItemOption>
          </IonItemOptions>
          <IonItemOptions side="end">
            <IonItemOption color="success" onClick={() => { ionItemRef && ionItemRef.current.closeOpened(); setAction("APPROVED"); setIsActionOpen(true) }}>
              <IonIcon slot="start" icon={checkmarkOutline}></IonIcon>
              Approve
            </IonItemOption>
          </IonItemOptions>
        </>
      }

      {item.status &&
        <IonItemOptions side="end">
          <IonItemOption onClick={() => { ionItemRef && ionItemRef.current.closeOpened(); setIsDetailOpen(true) }}>
            <IonIcon slot="start" icon={eyeOutline}></IonIcon>
            View Details
          </IonItemOption>
        </IonItemOptions>
      }

      <IonItem detail={false}>
        <div slot="start" className={`dot ${statusClass}`}></div>
        <IonLabel className="ion-text-wrap">
          <h2>
            {item.appname}
            <span className="date">
              <IonNote>{item.requestdate}</IonNote>
            </span>
          </h2>
          <h3>{item.username}</h3>
          <p className="ion-text-wrap">
            {isChecked ? translatedText : item.reason}
          </p>
          {sentiment &&
            <IonNote color={sentimentVariation}>
              AI-Based Sentiment Analysis of Reason is <strong>{sentiment}</strong> with accuracy of <strong>{sentimentPercent && Math.round(sentimentPercent * 10000) / 100}</strong> %
            </IonNote>
          }
          {isNonEnglish &&
            <IonItem lines='none'>
              <IonToggle checked={isChecked} onIonChange={(e: any) => { setIsChecked(e.target.checked); }}></IonToggle>
              <IonLabel color="medium">{isChecked ? "See Original Text" : "See Translated Text"}</IonLabel>
            </IonItem>

          }
        </IonLabel>
      </IonItem>
      {/*  Action Modal */}
      <IonModal isOpen={isActionOpen}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Worklist Action</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => setIsActionOpen(false)}>Close</IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <IonTextarea
            placeholder="Enter your reason here..."
            value={reason}
            onIonChange={(e) => setReason(e.detail.value)}
          />
        </IonContent>
        <IonButton onClick={() => processRequest()}>
          <IonIcon slot='start' icon={saveOutline}></IonIcon>
          Save
          {loading && <IonSpinner />}
        </IonButton>
      </IonModal>

      {/*  Detail Modal */}
      <IonModal isOpen={isDetailOpen}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Item Details</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => setIsDetailOpen(false)}>Close</IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <IonItem>
            <IonNote slot="start">App Name</IonNote>
            <IonLabel>{item.appname}</IonLabel>
          </IonItem>
          <IonItem>
            <IonNote slot="start">Request Date</IonNote>
            <IonLabel>{item.requestdate}</IonLabel>
          </IonItem>
          <IonItem>
            <IonNote slot="start">Requested By</IonNote>
            <IonLabel>{item.username}</IonLabel>
          </IonItem>
          <IonItem>
            <IonNote slot="start">Request Reason</IonNote>
            <IonLabel>{item.reason}</IonLabel>
          </IonItem>
          <IonItem>
            <IonNote slot="start">Status</IonNote>
            <IonLabel>{item.status}</IonLabel>
          </IonItem>

          <IonItem>
            <IonNote slot="start">Acted By</IonNote>
            <IonLabel>{item.approverusername}</IonLabel>
          </IonItem>
          <IonItem>
            <IonNote slot="start">Approver Reason</IonNote>
            <IonLabel>{item.approverreason}</IonLabel>
          </IonItem>


        </IonContent>
      </IonModal>
    </IonItemSliding>
  );
};

export default RequestListItem;
