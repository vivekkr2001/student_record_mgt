import Nav from "../../../components/Nav";
import Head from "next/head";
import SideNav from "../../../components/SideNav";
import axios from 'axios';
import { useRouter } from 'next/router'
import { useEffect } from 'react';
import { useState } from 'react';
import UserDetails from "../../../components/UserDetails";

export default function UserId() {
    const router = useRouter()

    let active = ""
    let links = [
        {name: "Users", icon: "assignment_ind", link: "/dashboard/student"},
        {name: "Courses", icon: "book", link: "/dashboard/student/courses"},
    ]

    const [data, setData] = useState();
    const [updateData, setUpdateData] = useState()

    async function fetchUsers() {
        let res = await axios.get(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/users/me`, {withCredentials: true})

        let updatable = {
            first_name: res.data.first_name,
            last_name: res.data.last_name,
            email: res.data.email,
            street_address: res.data.street_address,
            date_of_birth: res.data.date_of_birth,
        }
        setData(res.data)
        setUpdateData(updatable)
    }

    useEffect(() => {
        fetchUsers()
    }, []) 

    console.log(updateData);

    async function updateUser() {
        let res = await axios.put(
            `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/users/me`, 
            updateData,
            {withCredentials: true}
        )

        if (res.status == 204) {
            setDisplayEdit(false)
            fetchUsers()
        }

    }

    return (
        <>
            <Head>
                <title>Profile - {data && (data.name || `${data.first_name} ${data.last_name}`)}</title>
            </Head>
            <div className="fixed"> <SideNav links={links} active={active} /> </div>
            <div className="fixed"> <Nav/> </div>
            <UserDetails 
                data={data} 
                setData={setData} 
                updateData={updateData} 
                setUpdateData={setUpdateData} 
                updateUser={updateUser} 
                fetchUsers={fetchUsers}
            />
        </>
    )
}