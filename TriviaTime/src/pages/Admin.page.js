import { Button } from '@mui/material'
import { useContext } from 'react';
import { UserContext } from '../contexts/user.context';
 
export default function Admin() {
 const { logOutUser } = useContext(UserContext);
 
 // This function is called when the user clicks the "Logout" button.
 const logOut = async () => {
   try {
     // Calling the logOutUser function from the user context.
     const loggedOut = await logOutUser();
     // Now we will refresh the page, and the user will be logged out and
     // redirected to the login page because of the <PrivateRoute /> component.
     if (loggedOut) {
       window.location.reload(true);
     }
   } catch (error) {
     alert(error)
   }
 }

 const emptyDatabase = async () => {
  alert("Database has been empted. Please upload a new questions JSON file in the proper format.");
  const URL = '/empty';
  fetch(URL, {method: 'DELETE'}).then((response) => {
    if(!response.ok){
      throw new Error('Something went wrong')
    }
  })
  .catch((e) => {
    console.log(e)
  });
 } 
 return (
   <>
    <h1>Welcome, Administrator. Go ahead and administrate.</h1>
    <Button variant="contained" onClick={emptyDatabase}>Empty Database</Button><br></br><br></br>
    <h3>Upload New Questions</h3>
    <input type="file"/><br/><br/>
    <Button variant="contained">Upload</Button><br/><br/>
    <Button variant="contained" onClick={logOut}>Logout</Button>
   </>
 )
}