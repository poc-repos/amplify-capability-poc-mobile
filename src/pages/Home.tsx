import RequestListItem from '../components/RequestListItem';
import { useState } from 'react';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonList,
  IonNote,
  IonPage,
  IonProgressBar,
  IonRefresher,
  IonRefresherContent,
  IonTitle,
  IonToolbar,
  useIonViewWillEnter
} from '@ionic/react';
import './Home.css';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { logOutOutline } from 'ionicons/icons';
import { DataStore } from 'aws-amplify';
import { AccessRequests, WebApplications } from '../models';

const Home: React.FC = () => {

  const { user, signOut } = useAuthenticator((context) => [context.user]);

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  const getDataFromAWS = async () => {
    setLoading(true);
    const webapps = await DataStore.query(WebApplications);
    const model = await DataStore.query(AccessRequests);
    const sortedModel = model.sort((a: any, b: any) => +new Date(b.createdAt) - +new Date(a.createdAt))
    console.table(sortedModel)
    const transformedRequests:any = sortedModel.map(item => {
        const webapp = webapps && webapps.filter(w => w.id === item.accessRequestsWebApplicationsRelationId);
        return {
            id: item.id,
            username: item.username,
            reason: item.accessreason,
            status: item.status,
            appid: item.accessRequestsWebApplicationsRelationId,
            appname: webapp && webapp[0].name,
            requestdate: item.requestdate,
            approverusername: item.approverusername,
            approverreason: item.approverreason
        }
    });
    setRequests(transformedRequests);
    setLoading(false);
}

  useIonViewWillEnter(() => {
    getDataFromAWS();
  });

  const refresh = (e: CustomEvent) => {
    setTimeout(() => {
      e.detail.complete();
    }, 3000);
  };

  return (
    <IonPage id="home-page">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Amplify Demo App</IonTitle>
          {loading && <IonProgressBar type="indeterminate"></IonProgressBar>}
          <IonNote slot='end'>{user && user.username}</IonNote>
          <IonButton slot='end' fill="clear" onClick={signOut}>
            <IonIcon slot="icon-only" icon={logOutOutline}></IonIcon>
          </IonButton>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonRefresher slot="fixed" onIonRefresh={refresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>

        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">
              Amplify Demo App
            </IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonList>
          {requests && requests.map((r:any) => <RequestListItem key={r.id} item={r} />)}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Home;
