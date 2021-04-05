import React from 'react';
import styled from 'styled-components';
import { Card, DynamicForm, Link } from 'components/elements';
import { loginAction } from 'actions/auth.js';
import { connect } from 'react-redux';
import Axios from 'axios';
import { handleCatch } from '../../inc/functions';

const Login = ({ className, onLogin }) => {
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
        },
        {
            type: 'password',
            name: 'password',
            label: 'Password',
        },
    ];

    const handleLogin = (data) => {
        onLogin(data).then((res) => {
        }).catch((err) => {
            handleCatch(err);
        });
    };

    return (
        <Card className={className} header={headerCmp}>
            <DynamicForm fields={fields} submitText="Login" onSubmit={handleLogin} />
            <div style={{textAlign: 'center'}}>
                <Link to="/auth/register/">Register</Link>
            </div>
        </Card>
    );
};

const StyledLogin = styled(Login)`
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

const mapStateToProps = state => ({
});
const mapDispatchToProps = (dispatch) => ({
    onLogin: (data) => dispatch(loginAction(data)),
});
export default connect(mapStateToProps, mapDispatchToProps)(StyledLogin);
