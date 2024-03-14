import './App.css';
import { Component } from 'react';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      schools: [],
      updatedSchools: {}
    }

  }

  API_URL = "https://localhost:7209/";
  componentDidMount() {
    this.RefreshSchools();
  }
  async RefreshSchools() {
    try {
      const response = await fetch(this.API_URL + "api/School/GetSchools", { mode: "cors" });

      if (!response.ok) {
        throw new Error('Failed to fetch schools');
      }

      const data = await response.json();
      this.setState({ schools: data });
    } catch (error) {
      console.error('Error fetching schools:', error);
      // Handle error state if needed
    }
  }


  async addClick() {
    var newSchool = document.getElementById("Name").value;
    var newAddress = document.getElementById("Address").value;
    const data = {
      Name: newSchool,
      Address: newAddress
    };

    const response = await fetch(this.API_URL + "api/School/AddSchool", {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();
    alert(JSON.stringify(result));
    this.RefreshSchools();


  }
  async deleteClick(id) {

    fetch(this.API_URL + "api/School?id=" + id, {
      mode: "cors",
      method: "DELETE",
    }).then(res => res.json()).then((result) => { 
      alert(JSON.stringify(result)); 
      this.RefreshSchools(); 
    })
  }
  handleUpdate(id) {
    const { updatedSchools } = this.state;
    const updatedName = document.getElementById(`Name_${id}`).value;
    const updatedAddress = document.getElementById(`Address_${id}`).value;
    updatedSchools[id] = { Name: updatedName, Address: updatedAddress };
    this.setState({ updatedSchools });
  }


  async saveUpdates() {
    const { updatedSchools } = this.state;
    for (const [id, updatedSchool] of Object.entries(updatedSchools)) {
      // Send update request for each school
      try {
        const response = await fetch(`${this.API_URL}api/School/Update/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updatedSchool),
          mode: 'cors'
        });

        if (!response.ok) {
          throw new Error('Failed to update school');
        }
      } catch (error) {
        console.error('Error updating school:', error);
        // Handle error state if needed
      }
    }
    // Refresh the table after updating all schools
    this.RefreshSchools();
  }
  render() {
    const { schools } = this.state;
    return (
      <div className="App mt-2 col-md-12">
        <h2>School Management</h2>
        <div className="row ">
          <div className="col-md-4 ">
            <input id="Name" className="form-control" placeholder="Name"></input>
          </div>
          <div className="col-md-4">
            <input id="Address" className="form-control" placeholder="Address"></input>
          </div>
          <div className="col-md-4">
            <button onClick={() => this.addClick()} className="btn btn-primary">Add School</button>

          </div>
        </div>

        <div className="row">
          <div className="col-md-12">
            <table className="table table-bordered" style={{ backgroundColor: '#E8DAEF', border: '4px solid black' }}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Address</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {schools.map((sc) => (
                  <tr key={sc.id}>
                    <td>{sc.id}</td>
                    <td><input id={`Name_${sc.id}`} defaultValue={sc.name} className="form-control" /></td>
                    <td><input id={`Address_${sc.id}`} defaultValue={sc.address} className="form-control" /></td>
                    <td>
                      <button onClick={() => this.deleteClick(sc.id)} className='btn btn-danger'>Delete School</button>
                      <button onClick={() => this.handleUpdate(sc.id)} className='btn btn-warning mx-1'>Update</button>
                      <button onClick={() => this.saveUpdates()} className='btn btn-success'>Save Updates</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    );
  }
}

export default App;
