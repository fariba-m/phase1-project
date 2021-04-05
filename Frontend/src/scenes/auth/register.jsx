import React, { useState } from 'react';
import styled from 'styled-components';
import { Card, DynamicForm } from 'components/elements';
import { loginAction } from 'actions/auth.js';
import { connect } from 'react-redux';
import Axios from 'axios';
import { getAPIDefaultHeaders, handleCatch } from '../../inc/functions';
import { useHistory } from 'react-router';
import { BASE_URL } from '../../inc/constants';
import { Link } from '../../components/elements';

const Register = ({ className, onLogin }) => {
    const [loading, setLoading] = useState(false);
    const history = useHistory();

    const headerCmp = (
        <div className={`${className}__header`}>
            Dr.Salam
        </div>
    );

    const fields = [
        {
            type: 'text',
            name: 'username',
            label: 'Username',
            required: true,
        },
        {
            type: 'password',
            name: 'password',
            label: 'Password',
            required: true,
        },
        {
            type: 'password',
            name: 'password2',
            label: 'Password Confirmation',
            required: true,
        },
        {
            type: 'text',
            name: 'first_name',
            label: 'First Name',
            required: true,
        },
        {
            type: 'text',
            name: 'last_name',
            label: 'Last Name',
            required: true,
        },
        {
            type: 'number',
            name: 'phone',
            label: 'Phone',
            required: true,
        },
    ];

    const onSubmit = (data) => {
        setLoading(true);
        Axios.post(`${BASE_URL}/auth/register/`, data).then((res) => {
            setLoading(false);
            alert('Registeration done.');
            history.push('/auth/login/');
        }).catch((err) => {
            handleCatch(err);
            setLoading(false);
        });
    };

    return (
        <Card className={className} header={headerCmp}>
            <DynamicForm fields={fields} submitText="Register" onSubmit={onSubmit} />
            <div style={{textAlign: 'center'}}>
                <Link to="/auth/login/">Login</Link>
            </div>
        </Card>
    );
};

const StyledRegister = styled(Register)`
    &__header{
    width: 100%;
    text-align: center;
    /* padding-bottom: 20px; */
    font-weight: 900;
    letter-spacing: 5px;
    color: #999;
    font-size: 2rem;
    img{
      max-width: 100%;
      width: 200px;
    }
  }
`;
export default StyledRegister;
