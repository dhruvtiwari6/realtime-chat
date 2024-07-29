
import SingleChat from "./singlechat";

export const ChatBox = ({ SelectedChats, handleFetchAgain, fetchChats ,setSelectedChats , setExistingChats}) => {
 
  


  return (
    <div style = {{height : "84vh"}}>

    <SingleChat SelectedChats = {SelectedChats} handleFetchAgain = {handleFetchAgain} fetchChats = {fetchChats} setSelectedChats = {setSelectedChats} setExistingChats = {setExistingChats}/>
    </div> 
  
  
  );
};
