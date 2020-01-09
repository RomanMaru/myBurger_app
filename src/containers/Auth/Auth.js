import React, { useState, useEffect } from 'react'
import Input from '../../components/UI/Input/Input'
import Button from '../../components/UI/Button/Button'
import classes from './Auth.css'
import Spinner from '../../components/UI/Spinner/Spinner'
import * as actions from '../../store/actions/index'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { updateObject, checkValidity } from '../../shared/utility'

const auth = props => {
  const [authForm, setAuthForm] = useState({
    email: {
      elementType: 'input',
      elementConfig: {
        type: 'email',
        placeholder: 'Your E-Mail'
      },
      value: '',
      validation: {
        required: true,
        isEmail: true
      },
      valid: false,
      touched: false
    },
    password: {
      elementType: 'input',
      elementConfig: {
        type: 'password',
        placeholder: 'Your Password'
      },
      value: '',
      validation: {
        required: true,
        minLength: 6
      },
      valid: false,
      touched: false
    }
  })
  const [isSignUp, setIsSignUp] = useState(true)

  useEffect(() => {
    if (!props.buildingBurger && props.authRedirectPath !== '/') {
      props.onSetAuthRedirectPath()
    }
  }, [])


  const inputChangedHandler = (event, controlName) => {
    const updatedControls = updateObject(authForm, {
      [controlName]: updateObject(authForm[controlName], {
        value: event.target.value,
        valid: checkValidity(event.target.value, authForm[controlName].validation),
        touched: true
      })
    })
    setAuthForm(updatedControls)
  }

  const submitHandler = (event) => {
    event.preventDefault()
    props.onAuth(authForm.email.value, authForm.password.value, isSignUp)
  }

  const switchAuthModeHandler = () => {
    setIsSignUp(!isSignUp)
  }

  const formElementsArray = []
  for (let key in authForm) {
    formElementsArray.push({
      id: key,
      config: authForm[key]
    })
  }

  let form = formElementsArray.map(formElement => (
    <Input
      key={formElement.id}
      elementType={formElement.config.elementType}
      elementConfig={formElement.config.elementConfig}
      value={formElement.config.value}
      invalid={!formElement.config.valid}
      shouldValidate={formElement.config.validation}
      touched={formElement.config.touched}
      changed={(event) => inputChangedHandler(event, formElement.id)}
    />
  ))

  if (props.loading) {
    form = <Spinner />
  }

  let errorMessage = null
  if (props.error) {
    errorMessage = (
      <p>{props.error.message}</p>
    )
  }

  let authRedirect = null
  if (props.isAuthenicated) {
    authRedirect = <Redirect to={props.authRedirectPath} />
  }

  return (
    <div className={classes.Auth}>
      {authRedirect}
      {errorMessage}
      <form onSubmit={submitHandler}>
        {form}
        <Button btnType="Success" >SUBMIT</Button>
      </form>
      <Button
        btnType='Danger'
        clicked={switchAuthModeHandler}
      >SWITCH TO {isSignUp ? 'SIGNIN' : 'SIGNUP'}</Button>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    loading: state.auth.loading,
    error: state.auth.error,
    isAuthenicated: state.auth.token !== null,
    buildingBurger: state.burgerBuilder.building,
    authRedirectPath: state.auth.authRedirectPath
  }
}

const mapDispatrchToProps = dispatch => {
  return {
    onAuth: (email, password, isSingUp) => dispatch(actions.auth(email, password, isSingUp)),
    onSetAuthRedirectPath: () => dispatch(actions.setAuthRedirectPath('/'))
  }
}

export default connect(mapStateToProps, mapDispatrchToProps)(auth)