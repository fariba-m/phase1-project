import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { DynamicForm, Card, Button, Icon, Spin, Link } from 'components/elements';
import Axios from 'axios';
import { BASE_URL } from '../../../inc/constants';
import { getAPIDefaultHeaders, handleCatch, handleUploadMedia, handleEntityDelete } from '../../../inc/functions';
import { Redirect } from 'react-router';
import { DynamicFormView, Input, Table, Title } from '../../../components/elements';

const Visits = ({id}) => {
    const [visits, setVisits] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedDayIndex, setSelectedDayIndex] = useState();

    useEffect(() => {
        load();
    }, [])

    const load = () => {
        setLoading(true);
        Axios.get(`${BASE_URL}/doctors/${id}/visit_times`, getAPIDefaultHeaders()).then((res) => {
            setVisits(res.data);
            setLoading(false);
        }).catch((err) => {
            handleCatch(err);
            setLoading(false);
        });
    };

    const columns = [
        {
            title: 'Hour',
            dataIndex: 'title',
        },
        {
            title: '',
            dataIndex: 'datetime',
            render: (dt, obj) => obj.valid ? <Button success small onClick={() => book(dt)}>Book</Button> : <Button secondary small disabled>Booked</Button>
        }
    ]

    const book = (dt) => {
        setLoading(true);
        const data = {
            doctor_id: id,
            datetime: dt
        }
        Axios.post(`${BASE_URL}/doctor-visits/`, data, getAPIDefaultHeaders())
        .then(res => {
            alert('Booked successfully');
            load();
        })
        .catch(err => {
            handleCatch(err);
            setLoading(false);
        })
    }

    return (
        <div id="visits">
            <Card title="Visit Times" style={{marginTop: 20}}>
                <Spin active={loading}>
                    <Input.Select placeholder="Select Day" options={visits.map((day, i) => ({label: day.title, value: i}))} onChange={e => setSelectedDayIndex(parseInt(e.target.value))} />
                    {selectedDayIndex===undefined ? <div>Select Day</div> : <Table small dataSource={visits[selectedDayIndex].items} columns={columns} />}
                </Spin>
            </Card>
        </div>
    )
}

const Comments = ({id}) => {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadComments();
    }, [])

    const loadComments = () => {
        setLoading(true);
        Axios.get(`${BASE_URL}/doctors/${id}/comments`, getAPIDefaultHeaders()).then((res) => {
            setComments(res.data);
            setLoading(false);
        }).catch((err) => {
            handleCatch(err);
            setLoading(false);
        });
    };

    const columns = [
        {
            title: 'Author',
            dataIndex: 'member',
            render: m => `${m.first_name} ${m.last_name}`
        },
        {
            title: 'Comment',
            dataIndex: 'content'
        }
    ]

    const fields = [
        {
            type: 'textarea',
            name: 'content',
            required: true
        }
    ]

    const handleSubmit = (data) => {
        setLoading(true);
        data = {
            ...data,
            doctor_id: id
        }
        Axios.post(`${BASE_URL}/doctor-comments/`, data, getAPIDefaultHeaders())
        .then(res => {
            setLoading(false);
            setComments(x => [res.data, ...x]);
        })
        .catch(err => {
            handleCatch(err);
            setLoading(false);
        })
    }

    return (
        <div id="comments">
            <Card title="Comments" style={{marginTop: 20}}>
                <Spin active={loading}>
                    <Table small dataSource={comments} columns={columns} />
                    <DynamicForm fields={fields} submitText="Post Comment" onSubmit={handleSubmit} />
                </Spin>
            </Card>
        </div>
    )
}

const Detail = ({ className, match }) => {
    const [obj, setObj] = useState();
    const [categories, setCategories] = useState([]);
    const [fields, setFields] = useState([]);
    const [loading, setLoading] = useState(false);
    const [redirect, setRedirect] = useState();
    const { id } = match.params;

    const loadObj = () => {
        setLoading(true);
        Axios.get(`${BASE_URL}/doctors/${id}/`, getAPIDefaultHeaders()).then((res) => {
            setObj(res.data);
            setLoading(false);
        }).catch((err) => {
            handleCatch(err);
            setLoading(false);
        });
    };

    useEffect(() => {
        const flds = [
            {
                label: 'ID',
                value: obj?.unique_id
            },
            {
                label: 'Phone',
                value: obj?.phone
            },
            {
                label: 'Address',
                value: obj?.address
            },
            {
                label: 'Field',
                value: obj?.field
            },
            {
                label: 'Education',
                value: obj?.education
            },
        ];
        setFields(flds);
    }, [categories, obj]);

    useEffect(() => {
        if (id && !obj) {
            loadObj();
        }
    }, [id]);

    const cardMeta = (
        <div style={{ textAlign: 'right' }}>
            {/* <a href="#comments">
                <Button small>Comments</Button>
            </a> */}
            <Link to="/doctors/">
                <Button small secondary>
                    <Icon fa icon="angle-left" style={{ marginLeft: 4 }} />
                    Back
                </Button>
            </Link>
        </div>
    );

    if (redirect) {
        return <Redirect to={redirect} />;
    }
    return (
        <>
            <Card title={obj?.name} meta={cardMeta}>
                <Spin active={loading}>
                    <DynamicFormView cols={2} fields={fields} />
                </Spin>
            </Card>
            {id && <Visits id={id} />}
            {id && <Comments id={id} />}
        </>
        
    );
};

const StyledDetail = styled(Detail)`
    
`;

export default StyledDetail;
