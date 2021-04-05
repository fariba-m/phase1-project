import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Table, Card, Avatar, Button, Link, Pagination, Spin } from 'components/elements';
import Axios from 'axios';
import { BASE_URL, PAGE_SIZE } from '../../../inc/constants';
import { getAPIDefaultHeaders, handleCatch, handleEntityDelete, intComma } from '../../../inc/functions';

const List = ({ className }) => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState();
    const [page, setPage] = useState(1);

    const columns = [
        {
            title: 'ID',
            dataIndex: 'doctor',
            render: doc => doc.unique_id
        },
        {
            title: 'Name',
            dataIndex: 'doctor',
            render: doc => doc.name
        },
        {
            title: 'Field',
            dataIndex: 'doctor',
            render: doc => doc.field
        },
        {
            title: 'Education',
            dataIndex: 'doctor',
            render: doc => doc.education
        },
        {
            title: 'City',
            dataIndex: 'doctor',
            render: doc => doc.city.name
        },
        {
            title: 'Actions',
            dataIndex: 'id',
            render: (id, obj) => (
                <>
                    <Button small error onClick={() => remove(id)}>Remove</Button>
                    <Link to={`/doctors/${obj.doctor.id}/`}>
                        <Button small secondary>Detail</Button>
                    </Link>
                </>
            ),
        },

    ];

    useEffect(() => {
        load();
    }, [page]);

    const load = () => {
        setLoading(true);
        Axios.get(`${BASE_URL}/doctor-favs/`, getAPIDefaultHeaders()).then((res) => {
            setData(res.data);
            setLoading(false);
        }).catch((err) => {
            handleCatch(err);
            setLoading(false);
        });
    };

    const remove = (id) => {
        setLoading(true);
        Axios.delete(`${BASE_URL}/doctor-favs/${id}/`, getAPIDefaultHeaders()).then((res) => {
            load();
        }).catch((err) => {
            setLoading(false);
        });
    }

    return (
        <Card title="Favourites">
            <Spin active={loading}>
                <Table dataSource={data?.results || []} columns={columns} />
                <Pagination count={data?.count || 0} current={page} onChange={setPage} />
            </Spin>
        </Card>
    );
};

export default List;
