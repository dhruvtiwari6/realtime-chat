// import ScrollableFeed from 'react-scrollable-feed'
// import { UserContext } from '../pages/userProvider';
// import { useContext } from 'react';

// const ScrollableChat = ({messages}) => {
//     const {User} = useContext(UserContext);
//     return(
//        <ScrollableFeed>
//         {messages && messages.map((m, i) => (
//             <div key = {m._id} style = {{display : "flex",backgroundColor : m._id === User ? "red" : "blue", margin:"2px"}}>
//                        {m.content}
//             </div>
//         ))}
//        </ScrollableFeed>
//     )
// }

// export default ScrollableChat;