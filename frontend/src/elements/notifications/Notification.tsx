import {Message, MessageType} from "../../../types.ts";
import CrewRequest from "./CrewRequest.tsx";

interface Props {
    notification: Message;
    onAccept: () => void;
    onReject: () => void;

}

const Notification: React.FC<Props> = ({ notification, onAccept, onReject })=> {
    return (
        <div className="d-grid gap-2 bg-dark rounded-2 p-3 mb-2"
             style={{
                 backgroundColor: "rgba(45,45,45,0.9)",
             }}>
            {
                notification.type === MessageType.CrewRequest ?

                    (notification.status === "active" ? <CrewRequest n={notification} onAccept={onAccept}
                                                                     onReject={onReject}/> :

                        (notification.status === "approved" ?
                            notification.expeditionName + ": Ваш запрос на участие в экипаже принят" :
                            notification.expeditionName + ": Ваш запрос на участие в экипаже отклонен")) :

                    notification.type === MessageType.News ? notification.description : ""
            }
        </div>
    )
}

export default Notification;