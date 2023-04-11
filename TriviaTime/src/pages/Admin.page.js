import Button from 'react-bootstrap/Button';

export default function Admin() {

  const refreshDatabase = e => {

    const input = document.querySelector("#input");
    const fileReader = new FileReader();
    fileReader.readAsText(input.files[0], "UTF-8");
    fileReader.onload = e => {
      console.log(e.target.result);

      let data = e.target.result;

      console.log("DATAAAAA");
      console.log(data);

      const URL = '/upload';

      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: data
    };

      fetch(URL, requestOptions).then((response) => {
        if(!response.ok){
          throw new Error('Something went wrong')
        }
        alert("Database has been emptied and repopulated with the selected questions.");
      })
      .catch((e) => {
        console.log(e)
      });
    };
  };
  return (
    <>
      <h1>Upload Json file - Example</h1>

      <input type="file" id="input"/>
      <Button onClick={refreshDatabase}>Refresh Database</Button>
      <br />
    </>
  );
}