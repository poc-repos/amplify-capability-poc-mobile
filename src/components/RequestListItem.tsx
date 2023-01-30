import { useAuthenticator } from '@aws-amplify/ui-react';
import {
  IonButton,
  IonButtons,
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
  IonToolbar
} from '@ionic/react';
import { DataStore } from 'aws-amplify';
import { checkmarkOutline, closeOutline, eyeOutline, saveOutline } from 'ionicons/icons';
import { useState } from 'react';
import { AccessRequests } from '../models';
import './RequestListItem.css';

const RequestListItem: any = ({ item }: any) => {

  const { user } = useAuthenticator((context) => [context.user]);

  const [isActionOpen, setIsActionOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [reason, setReason] = useState<any>("");
  const [action, setAction] = useState<any>("");
  const [loading, setLoading] = useState(false);

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

  return (
    <IonItemSliding>
      {!item.status &&
        <>
          <IonItemOptions side="start">
            <IonItemOption color="danger" onClick={() => { setAction("REJECTED"); setIsActionOpen(true) }}>
              <IonIcon slot="start" icon={closeOutline}></IonIcon>
              Reject
            </IonItemOption>
          </IonItemOptions>
          <IonItemOptions side="end">
            <IonItemOption color="success" onClick={() => { setAction("APPROVED"); setIsActionOpen(true) }}>
              <IonIcon slot="start" icon={checkmarkOutline}></IonIcon>
              Approve
            </IonItemOption>
          </IonItemOptions>
        </>
      }

      {item.status &&
        <IonItemOptions side="end">
          <IonItemOption onClick={()=> setIsDetailOpen(true)}>
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
          <p>
            {item.reason}
          </p>
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
            <IonNote slot="start">Approved By</IonNote>
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
