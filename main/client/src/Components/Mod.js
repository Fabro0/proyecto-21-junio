import React, { useContext, useState, useEffect } from 'react'
import { AuthContext } from '../Context/AuthContext';
import AuthService from '../Services/AuthService';
import swal from 'sweetalert';

const Admin = props => {
    const [search, setSearch] = useState("");
    let [elinput, setElInput] = useState({ dni: 0, comapnyid: "", role: "user", username: "" })
    let [loading, isLoading] = useState(false)
    let [newDict, setNewDict] = useState({})
    const handleInput = e => {
        setSearch(e.target.value);
    };
    const { user } = useContext(AuthContext);

    let [content, setContent] = useState(null)
    let [contenido, setContenido] = useState(null)

    useEffect(() => {
        isLoading(true)

        async function showw() {
            AuthService.getMod().then(res => {
                setContent(res.data.sort(function (a, b) {
                    if (a.companyID < b.companyID) { return -1; }
                    if (a.companyID > b.companyID) { return 1; }
                    return 0;
                }));
                var contendio = res.data.sort(function (a, b) {
                    if (a.companyID < b.companyID) { return -1; }
                    if (a.companyID > b.companyID) { return 1; }
                    return 0;
                })
                setContenido(contendio);

                isLoading(false)
                rearrange(contendio)
            }, [])

        }

        showw()


    }, []);


    const searchh = (e) => {
        if (content) {
            e.preventDefault();
            var contenido = content.filter(function (username) {
                return username.username.includes(search)
            })
            setContenido(contenido)
        }
    }
    const chau = (dni) => {
        swal("Estas seguro de ello? No podras volver atrás", {
            buttons: {
                cancel: "Cancelar",
                catch: {
                    text: "Eliminar",
                    value: "borrar",
                }
            },
        })
            .then((value) => {
                switch (value) {

                    case "borrar":
                        swal("Eliminado", "El trabajador no forma mas parte de la empresa", "success");
                        AuthService.removeUser(dni).then(res => {
                            showData()
                        }, [])
                        break;

                    default:

                }
            });
    }
    const registrarNuevo = async () => {
        const dni = elinput.dni;
        const role = elinput.role;
        const username = String(dni);
        const companyid = elinput.companyid;
        await AuthService.registerNew({ dni: dni, companyID: companyid, role: role, username: username, companyid: companyid }).then(res => {
            //console.log(res)
        }, [])

        showData()

    }
    const handleChange = (e) => {
        setElInput({ ...elinput, [e.target.name]: e.target.value });
    }
    const showData = () => {

        AuthService.getMod().then(res => {
            setContent(res.data.sort(function (a, b) {
                if (a.companyID < b.companyID) { return -1; }
                if (a.companyID > b.companyID) { return 1; }
                return 0;
            }));
            setContenido(res.data.sort(function (a, b) {
                if (a.companyID < b.companyID) { return -1; }
                if (a.companyID > b.companyID) { return 1; }
                return 0;
            }));

        }, [])
    }
    const rearrange = (contenidoo) => {
        //console.log('contee', contenidoo)
        var newDict = {}
        var users = []
        if (contenidoo) {
            let companyid = ""
            for (let i = 0; i < contenidoo.length; i++) {
                if (contenidoo[i].companyID !== companyid) {

                    companyid = contenidoo[i].companyID
                    users.push(contenidoo[i])
                    //console.log(newDict[companyid])

                    if (users) {
                        newDict[contenidoo[i].companyID] = users
                        users = []
                    } else {
                        users.push(contenidoo[i])
                    }

                }
                else {
                    users.push(contenidoo[i])
                }
            }
        }
        //console.log('dict', newDict)
        setNewDict(newDict)
    }
    return (
        <div className="container" >
            <div className="m-2 arriba d-flex flex-row-reverse">

                <form onSubmit={(e) => searchh()} >
                    <input type="text" className="m-2" id="23" value={search} onChange={e => handleInput(e)} />
                    <button type="submit" className="btn btn-info" onClick={searchh}>OK</button>
                </form>
                <button type="button" className="btn btn-info m-2 " data-toggle="modal" data-target="#exampleModalCenter"> +</button>
                <div className="modal fade" id="exampleModalCenter" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLongTitle">New User</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <input
                                    type="number"
                                    placeholder="User's DNI"
                                    required
                                    name="dni"
                                    className="form-control form-control-lg"
                                    value={elinput.dni}
                                    onChange={handleChange} />
                                <br /><br />
                                <input
                                    type="text"
                                    placeholder="User's companyid"
                                    required
                                    name="companyid"
                                    className="form-control form-control-lg"
                                    value={elinput.companyid}
                                    onChange={handleChange} />
                                <br /><br />
                                <select name="role" className="form-control form-control-lg" onChange={handleChange} value={elinput.role}>
                                    <option value="admin">admin</option>
                                    <option value="user">user</option>
                                </select>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={() => registrarNuevo()}>Create</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal fade" id="exampleModalCenter" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLongTitle">New User</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>


                    </div>
                </div>
            </div>
            {!loading ? (
                <div>
                    {contenido ? (
                        contenido.map(user =>
                            <table className="table table-hover text-center table-responsive-lg">
                                <thead className="thead-dark">
                                    <tr>
                                        <th className="">Nombre</th>
                                        <th className="">DNI</th>
                                        <th className="">E-Mail</th>
                                        <th className="">Modelo Entrenado?</th>
                                        <th className="">Profile Picture</th>
                                        <th className="">Rol</th>
                                        <th>Comp. ID</th>
                                        <th className="">Cantidad de Fotos</th>
                                        <th>Eliminar</th>
                                    </tr>
                                </thead>
                                <tbody>

                                    <tr key={user._id}>

                                        <td>{!user.createdAccount ? (<p>No registrado</p>) : (<p>{user.username}</p>)}</td>
                                        <td ><p>{user.dni}</p></td>
                                        <td>{user.createdAccount ? (<p><a rel="noopener noreferrer" href={"https://mail.google.com/mail/u/0/?view=cm&fs=1&to=" + user.mail + "&tf=1"} target="_blank">{user.mail}</a></p>) : (<p>no creada</p>)}</td>
                                        <td> {user.createdAccount ? (!user.modeloEntrenado ? <p>no</p> : <p>si</p>) : (<p>no creada</p>)}</td>
                                        <td>{user.createdAccount ? <img className="img-fluid" style={{ width: '100px' }} src={'http://192.168.1.203:5000\\user\\pfp\\' + user.companyID + '\\' + user.dni} alt={user.username} /> : (<p>no creada</p>)}</td>

                                        <td><p>{user.role}</p></td>
                                        <td><p>{user.companyID}</p></td>
                                        <td><p >{user.createdAccount ? (user.cantidadFotos) : (<p>no creada</p>)}</p></td>

                                        <td> {user.role !== "mod" ? (<button className="btn btn-danger" onClick={() => chau(user._id)} >X</button>) : (<p>es mod bro</p>)} </td>
                                    </tr>
                                </tbody>
                            </table>
                        )

                    ) : (<tr><td>No content...</td></tr>)}
                </div>
            ) : (<h1>loading</h1>)}

            <br />
            <br />
        </div>

    )
}
export default Admin