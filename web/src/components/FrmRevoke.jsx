import React, { Component } from 'react';
import * as testimonialService from '../services/testimonialService';
import { withRouter } from './hoc/withRouter';
import logger from '../services/logService';
import {toast} from 'react-toastify';

class FrmRevoke extends Component {
    revoke =  async () => {
        try {
            const id = this.props.router.params.code;
            const {status, data} = await testimonialService.revokeInvitation(id);            
        } catch (error) {
            logger.log(error?.response ?? error);
        }
    };

    componentDidMount() {
        this.revoke();
        toast.success('Gracias por tu colaboración.');
        return window.location = '/';
    }

    render() {
        return null;
    }
};

export default withRouter(FrmRevoke);