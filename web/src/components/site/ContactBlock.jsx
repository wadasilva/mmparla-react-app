import React, { Component } from 'react';
import Joi from 'joi-browser';
import Map from '../Map';
import Form from '../common/form';
import Input from '../common/input';
import Textarea from '../common/textarea';
import * as contactService from '../../services/contactService';
import { toast } from 'react-toastify';

class ContactBlock extends Form {
    initialState = {
        data: {
            name: '',
            email: '',
            subject: '',
            message: '',
        },
        errors: {}
    };

    state = this.initialState;
    
    schema = {
        name: Joi.string().required().min(3).max(100).label('Name'),
        email: Joi.string().required().email().label('Email'),
        subject: Joi.string().optional().max(50).label('Subject'),
        message: Joi.string().optional().min(10).max(500).label('Message'),
    };

    renderInput(name, label, { type = "text", isReadonly = false, placeholder = '' } = {}) {
        const { data, errors } = this.state;
        return (
          <Input
            type={type}
            name={name}
            value={data[name]}
            readOnly={isReadonly ? "readonly" : null}
            label={label}
            placeholder={placeholder}
            onChange={this.handleChange}
            error={errors[name]}
          />
        );
      }
    
      renderTextArea(name, label, placeholder = label) {
        const { data, errors } = this.state;
        return (
          <Textarea
            name={name}
            value={data[name]}
            label={label}
            placeholder={placeholder}
            onChange={this.handleChange}
            error={errors[name]}
          />
        );
      }

      renderButton(label) {
        return (
          <button
            type="submit"
            className="btn btn--primary"
            disabled={this.validate()}>
            {label}
          </button>
        );
      }

    doSubmit = async () => {
        try {
            await contactService.sendMessage(this.state.data);
            toast.success('Message sent succesfully!');

            this.setState(this.initialState);
        } catch (error) {
            console.log(error);
        }
    };

    render() {
        return (
            <section id="contact-block" className="block contact-block">
            <header className="block__header aos-overflow-hidden">
                <h2 className="block__heading" data-aos="fade-up">Contacta con nosotros</h2>
            </header>
            <div className="grid grid--1x2 container aos-overflow-hidden">
                <div className="contact__address" data-aos="fade-right">
                    <div className="address__text">
                        <h3 className="contact-address__heading">Visitanos en</h3>
                        <p className="contact-address__text">C/ Juan Ramón Jiménez, 31 Esc. Derecha, 5º Pta 18 46006 Valencia</p>
                        
                        <h3 className="contact-address__heading">Llámanos o escribenos un WhatsApp a:</h3>
                        <a href="tel:+34-631-93-98-20" className="contact-address__phone">+34 631 93 98 20</a>
                    </div>
                    <Map />
                </div>
                <form className="contact__email aos-overflow-hidden" data-aos="fade-left" onSubmit={this.handleSubmit}>
                    {this.renderInput('name', '', { placeholder: 'Nombre' })}
                    {this.renderInput('email', '', { placeholder: 'Email' })}
                    {this.renderInput('subject', '', { placeholder: 'Asunto' })}
                    {this.renderTextArea('message', '', 'Comentario')}
                    {this.renderButton('Enviar')}
                </form>
            </div>
        </section>
        );
    }
}

export default ContactBlock;