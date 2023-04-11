import Button from 'react-bootstrap/Button';
import { useContext } from 'react';
import { UserContext } from '../contexts/user.context';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import 'bootstrap/dist/css/bootstrap.min.css';

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

  /* 
  This function pulls data from the JSON file in the input html element and reads it.
  It then sends the documents contained in this file to a post request that inserts
  the documents into the database.
  */
  const refreshDatabase = e => {

    // Select the input element
    const input = document.querySelector("#input");

    // Read the file that is held in the input element
    const fileReader = new FileReader();
    fileReader.readAsText(input.files[0], "UTF-8");
    fileReader.onload = e => {
      console.log(e.target.result);

      // Assign the contents of the file to a variable
      let data = e.target.result;

      // Set the route
      const URL = '/upload';

      // Set header information
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: data
    };

    // Send post request to the route
      fetch(URL, requestOptions).then((response) => {
        if(!response.ok){
          throw new Error('Something went wrong')
        }
        if(response.status === 200){
          alert("Database has been completely overwritten with these new questions!")
        }
      })
      .catch((e) => {
        console.log(e)
      });
    };
  };

  /* 
  This function pulls data from the JSON file in the input html element and reads it.
  It then appends the documents contained to the database.
  */
  const appendToDatabase = e => {
    // Select the input element
    const input = document.querySelector("#input");

    // Read the file that is held in the input element
    const fileReader = new FileReader();
    fileReader.readAsText(input.files[0], "UTF-8");
    fileReader.onload = e => {
      console.log(e.target.result);

      // Assign the contents of the file to a variable
      let data = e.target.result;

      // Set the route
      const URL = '/append';

      // Set header information
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: data
    };

    // Send post request to the route
      fetch(URL, requestOptions).then((response) => {
        if(!response.ok){
          throw new Error('Something went wrong')
        }
        if(response.status === 200){
          alert("New questions have been added to the database successfully!")
        }
      })
      .catch((e) => {
        console.log(e)
      });
    };
  };

  return (
    <>
    <Container className="d-flex align-items-center justify-content-center text-center not-found-container">
      <Row>
        <Col>
        <h1>Upload New Questions</h1>
        <h3>Use properly formatted JSON file</h3>
        <input type="file" id="input"/><br/><br/><br/><br/>
        <h3>What should we do with these new questions?</h3><br/><br/>
        <Button size="lg" onClick={refreshDatabase}>Refresh Entire Database</Button><br/><br/>
        <Button size="lg" onClick={appendToDatabase}>Append New Questions</Button><br/><br/><br/><br/>
        <Button size="lg" onClick={logOut}>Log Out</Button>
        </Col>
      </Row>
    </Container>
      
    </>
  );
}