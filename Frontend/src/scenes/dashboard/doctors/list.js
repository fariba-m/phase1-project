import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Table, Card, Avatar, Button, Link, Pagination, Spin } from 'components/elements';
import Axios from 'axios';
import { BASE_URL, PAGE_SIZE } from '../../../inc/constants';
import { getAPIDefaultHeaders, handleCatch, handleEntityDelete, intComma } from '../../../inc/functions';
import { Input, Modal } from '../../../components/elements';


const DoctorList = ({ className }) => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState();
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const columns = [
        {
            title: 'ID',
            dataIndex: 'unique_id',
        },
        {
            title: 'Name',
            dataIndex: 'name'
        },
        {
            title: 'Field',
            dataIndex: 'field'
        },
        {
            title: 'Education',
            dataIndex: 'education'
        },
        {
            title: 'City',
            dataIndex: 'city',
            render: (c) => c.name
        },
        {
            title: 'Actions',
            dataIndex: 'id',
            render: (id, obj) => (
                <>
                    <Button small onClick={() => addFav(id)}>+ Fav</Button>
                    <Link to={`/doctors/${id}/`}>
                        <Button small secondary>Detail</Button>
                    </Link>
                </>
            ),
        },

    ];
    useEffect(() => {
        load();
    }, [page, search]);

    const load = () => {
        setLoading(true);
        Axios.get(`${BASE_URL}/doctors/?page=${page}&search=${search}`, getAPIDefaultHeaders()).then((res) => {
            setData(res.data);
            setLoading(false);
        }).catch((err) => {
            handleCatch(err);
            setLoading(false);
        });
    };

    const addFav = (id) => {
        setLoading(true);
        const data = {
            doctor_id: id
        }
        Axios.post(`${BASE_URL}/doctor-favs/`, data, getAPIDefaultHeaders()).then((res) => {
            alert('Doctor added to favourites');
            setLoading(false);
        }).catch((err) => {
            alert('This doctor has added to favourites before!')
            setLoading(false);
        });
    }

    const handleSearchOnKeyDown = ev => {
        if (ev.keyCode === 13) {
            setSearch(ev.target.value);
        }
    }

    const cardMeta = <div>
        <Input placeholder="Search for doctor..." onKeyDown={handleSearchOnKeyDown} />
    </div>


    return (
        <Card title="Doctors" meta={cardMeta}>
            {/* <OrderDetailModal active={modalActive} items={modalItems} onToggle={() => {setModalActive(!modalActive)}} /> */}
            <Spin active={loading}>
                <Table dataSource={data?.results || []} columns={columns} />
                <Pagination count={data?.count || 0} current={page} onChange={setPage} />
            </Spin>
        </Card>
    );
};

export default DoctorList;
