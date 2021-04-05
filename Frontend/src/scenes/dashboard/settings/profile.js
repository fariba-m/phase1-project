import Axios from 'axios';
import React, {useState, useEffect} from 'react';
import {Card, DynamicForm, Spin} from '../../../components/elements';
import { BASE_URL } from '../../../inc/constants';
import { getAPIDefaultHeaders, handleCatch } from '../../../inc/functions';

const Settings = ({className}) => {
    const [loading, setLoading] = useState(false);
    const [obj, setObj] = useState();
    const [fields, setFields] = useState([]);

    useEffect(() => {

        setFields([
            {
                label: 'Username (cannot change)',
                type: 'text',
                value: obj?.user.username,
                disabled: true
            },
            {
                label: 'First Name',
                name: 'first_name',
                type: 'text',
                value: obj?.first_name,
                required: true
            },
            {
                label: 'Last Name',
                name: 'last_name',
                type: 'text',
                value: obj?.last_name,
                required: true
            },
            {
                label: 'Phone',
                name: 'phone',
                type: 'number',
                value: obj?.phone,
                required: true
            }
        ]);

    }, [obj])

    useEffect( () => {
        load();
    }, [])

    const load = () => {
        setLoading(true);

        Axios.get(`${BASE_URL}/member/profile/`, getAPIDefaultHeaders())
        .then(res => {
            setLoading(false);
            setObj(res.data);
        })
        .catch(err => {
            handleCatch(err);
            setLoading(false);
        })
    }

    const handleSubmit = (data) => {
        setLoading(true);
        Axios.put(`${BASE_URL}/member/profile/`, data, getAPIDefaultHeaders())
        .then(res => {
            setObj(res.data);
            setLoading(false);
        })
        .catch(err => {
            handleCatch(err);
            setLoading(false);
        })
    }

    return (
        <Card title="Settings">
            <Spin active={loading}>
                <DynamicForm isEdit={true} fields={fields} submitText="Save" onSubmit={handleSubmit} />
            </Spin>
        </Card>
    )
}
export default Settings;
