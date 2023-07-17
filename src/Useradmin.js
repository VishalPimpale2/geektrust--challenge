import React, { useEffect, useState } from "react";
import axios from "axios";
import pic from "./editeLogo.png"
import deleteIcon from "./deleteButton.png"


export default function Useradmin() {

    const [datas, setDatas] = useState([]);
    const [searchInput, setSearchInput] = useState("")
    const [searchApiData, setSearchAipData] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [deleteAllD, setDeleteAllD] = useState([])
    const recordsPerPage = 10;
    const lastIndex = currentPage * recordsPerPage;
    const firstIndex = lastIndex - recordsPerPage;
    const records = datas.slice(firstIndex, lastIndex);
    const npage = Math.ceil(datas.length / recordsPerPage);
    const numbers = [...Array(npage + 1).keys()].slice(1)


    async function getData(query) {
        let url = "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
        const data = await axios.get(url)
        setDatas(data.data)
        setSearchAipData(data.data)

    }

    const handleCheck = (e, id) => {
        const { name, checked } = e.target;
        if (name === "allSelect") {
            let tempUser = records.map((user) => {
                return { ...user, ischeked: checked }
            })

            setDatas(tempUser)
            setSearchAipData(tempUser)
            console.log(tempUser);
        }

        else {
            let tempUser = records.map(user => user.name === name ? { ...user, ischeked: checked } : user)
            setDatas(tempUser)
            setSearchAipData(tempUser)
            console.log(name);

        }

    }

    useEffect(() => {
        getData()

    }, [])

    const onInputChange = (event) => {
        if (event.target.value === "") {
            setDatas(searchApiData)
        }
        else {
            const filterResult = searchApiData.filter(item => item.name.toLowerCase().includes(event.target.value.toLowerCase()) || item.email.toLowerCase().includes(event.target.value.toLowerCase() || item.role.toLowerCase().includes(event.target.value.toLowerCase())))
            setDatas(filterResult)
        }
        setSearchInput(event.target.value)
    }
    const handleDelete = ({ id }) => {

        setDatas(datas.filter((users) => users.id !== id))
        console.log(datas);

    }
    const handleAllDelete = async ({ id }) => {

        let allDeleteData = []
        for (let i = 0; i < datas.length; i++) {
            if (datas[i].ischeked !== true) {
                setDeleteAllD(allDeleteData.push(datas[i]))

            }
        }

        setDatas(allDeleteData)
        setSearchAipData(allDeleteData)

        console.log(...allDeleteData)
    }


    return (
        <>

            <div className="container">
                <div className="searchbar-input">
                    <input
                        id="search"
                        type="text"
                        value={searchInput}
                        name="search-input"
                        placeholder="Search by name,email or role"
                        onInput={(e) => onInputChange(e)}
                    />
                </div>

                <div className="table-data">
                    <table className="header-item" >

                        <thead>
                            <tr  >

                                <th> <input
                                    type="checkbox"
                                    checked={datas.filter((user) => user?.ischeked !== true).length < 1}
                                    name="allSelect"
                                    onChange={handleCheck}
                                /> </th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Actions</th>
                            </tr>

                        </thead>
                        <tbody>
                            {records.map((val, key) => {
                                return (


                                    <tr key={key} >
                                        <td>  <input
                                            type="checkbox"

                                            checked={val?.ischeked || false}
                                            onChange={handleCheck}
                                            name={val.name}

                                        /></td>
                                        <td>{val.name}</td>
                                        <td>{val.email}</td>
                                        <td>{val.role.slice(0, 1).toUpperCase() + val.role.slice(1)}</td>
                                        <td > <img src={pic} />    <img onClick={() => handleDelete(val)} className="deleteIcon" src={deleteIcon} /></td>

                                    </tr>
                                );
                            })}
                        </tbody>

                    </table>
                </div>
                <nav>

                    <button className="allSelect" onClick={handleAllDelete} >Delete Selected</button>
                    <ul className="pagination">

                        <li className="page-item">
                            <button className="page-item" onClick={() => changeCPage(1)}> &lt;&lt;</button>
                        </li>
                        <li className="page-item">
                            <button disabled={currentPage <= 1} className="page-item" onClick={prePage}> &lt; </button>
                        </li>
                        {
                            numbers.map((n, i) => (
                                <li className={`page-item ${currentPage === n ? 'active' : ""}`} key={i}>
                                    <button className="page-item" onClick={() => changeCPage(n)}> {n} </button>
                                </li>
                            ))
                        }
                        <li className="page-item">
                            <button disabled={currentPage >= 5} className="page-item" onClick={() => nextPage()}> &gt;</button>
                        </li>
                        <li className="page-item">
                            <button className="page-item" onClick={() => changeCPage(5)}> &gt;&gt;</button>
                        </li>
                    </ul>
                </nav>

            </div>

        </>

    )
    function prePage() {
        if (currentPage !== firstIndex) {
            setCurrentPage(currentPage - 1)
        }
    }
    function changeCPage(id) {
        setCurrentPage(id)
    }
    function nextPage() {
        if (currentPage !== lastIndex)
            setCurrentPage(currentPage + 1)
    }


}