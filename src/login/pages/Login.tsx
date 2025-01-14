import { useState } from "react";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import { clsx } from "keycloakify/tools/clsx";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import Button from '@mui/material/Button'
import { Box, FormHelperText, TextField } from "@mui/material";
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

export default function Login(props: PageProps<Extract<KcContext, { pageId: "login.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { kcClsx } = getKcClsx({
        doUseDefaultCss,
        classes
    });

    const { social, realm, url, usernameHidden, login, auth, registrationDisabled, messagesPerField } = kcContext;

    const { msg, msgStr } = i18n;

    const [isLoginButtonDisabled, setIsLoginButtonDisabled] = useState(false);
  
    const [showPassword, setShowPassword ] = useState(false);

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayMessage={!messagesPerField.existsError("username", "password")}
            headerNode={msg("loginAccountTitle")}
            displayInfo={realm.password && realm.registrationAllowed && !registrationDisabled}
            infoNode={
                <div id="kc-registration-container">
                    <div id="kc-registration">
                        <span>
                            {msg("noAccount")}{" "}
                            <a tabIndex={8} href={url.registrationUrl}>
                                {msg("doRegister")}
                            </a>
                        </span>
                    </div>
                </div>
            }
            socialProvidersNode={
                <>
                    {realm.password && social?.providers !== undefined && social.providers.length !== 0 && (
                        <div id="kc-social-providers" className={kcClsx("kcFormSocialAccountSectionClass")}>
                            <hr />
                            <h2>{msg("identity-provider-login-label")}</h2>
                            <ul className={kcClsx("kcFormSocialAccountListClass", social.providers.length > 3 && "kcFormSocialAccountListGridClass")}>
                                {social.providers.map((...[p, , providers]) => (
                                    <li key={p.alias}>
                                        <a
                                            id={`social-${p.alias}`}
                                            className={kcClsx(
                                                "kcFormSocialAccountListButtonClass",
                                                providers.length > 3 && "kcFormSocialAccountGridItem"
                                            )}
                                            type="button"
                                            href={p.loginUrl}
                                        >
                                            {p.iconClasses && <i className={clsx(kcClsx("kcCommonLogoIdP"), p.iconClasses)} aria-hidden="true"></i>}
                                            <span
                                                className={clsx(kcClsx("kcFormSocialAccountNameClass"), p.iconClasses && "kc-social-icon-text")}
                                                dangerouslySetInnerHTML={{ __html: kcSanitize(p.displayName) }}
                                            ></span>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </>
            }
        >
            <div id="kc-form">
                <div id="kc-form-wrapper">
                    {realm.password && (
                        <form
                            id="kc-form-login"
                            onSubmit={() => {
                                setIsLoginButtonDisabled(true);
                                return true;
                            }}
                            action={url.loginAction}
                            method="post"
                        >
                            {!usernameHidden && (
                                <div className={kcClsx("kcFormGroupClass")}>
                                    <TextField
                                        tabIndex={2}
                                        fullWidth
                                        size="small"
                                        id="username"
                                        type="string"
                                        label={
                                            !realm.loginWithEmailAllowed
                                                ? msg("username")
                                                : !realm.registrationEmailAsUsername
                                                    ? msg("usernameOrEmail")
                                                    : msg("email")
                                        }
                                        name="username"
                                        defaultValue={login.username ?? ""}
                                        variant="outlined"
                                        autoComplete="username"
                                        error={messagesPerField.existsError("username", "password")}
                                        helperText={messagesPerField.getFirstError("username", "password")}
                                        color="secondary"
                                        sx={{
                                            '& .MuiFormHelperText-root.Mui-error':
                                                { color: 'red' },
                                            '& input:-webkit-autofill': {
                                              '-webkit-box-shadow': '0 0 0 100px #0e293f inset'
                                            },
                                        }}
                                    />
                                </div>
                            )}

                            <div className={kcClsx("kcFormGroupClass")}>
                                <FormControl
                                  sx={{
                                    width: '100%',
                                    '& .MuiFormHelperText-root.Mui-error':
                                        { color: 'red' },
                                    '& .MuiFormControl-root.Mui-focused': {
                                        borderColor: 'green', // Change outline color to green
                                    },
                                    '& .MuiInputLabel-root.Mui-focused': {
                                         color: 'green', // Change label color to green when focused
                                    },
                                    '& input:-webkit-autofill': {
                                      '-webkit-box-shadow': '0 0 0 100px #0e293f inset'
                                    },
                                  }}
                                  variant="outlined"
                                  size="small"
                                  color="secondary"  
                                >
                                  <InputLabel htmlFor="outlined-adornment-password">{msg("password")}</InputLabel>
                                    <OutlinedInput 
                                        sx={{
                                            width: '100%',
                                            '& .MuiFormHelperText-root.Mui-error':
                                                { color: 'red' },
                                            '& .MuiFormControl-root.Mui-focused': {
                                                borderColor: 'green', // Change outline color to green
                                            },
                                            '& .MuiInputLabel-root.Mui-focused': {
                                                color: 'green', // Change label color to green when focused
                                            }
                                        }}    
                                    tabIndex={3}
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete="current-password"
                                    error={messagesPerField.existsError("username", "password")}
                                    endAdornment={
                                    <InputAdornment
                                        position="end"
                                    >
                                    <IconButton
                                        disableRipple
                                        aria-label="toggle password visibility"
                                        onClick={() => setShowPassword(!showPassword)}
                                        onMouseDown={e => e.preventDefault}
                                        edge="end"
                                        font-size="8px"
                                      >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                      </IconButton>
                                    </InputAdornment>
                                    }
                                    label="Password"
                                  />
                                  {usernameHidden && messagesPerField.existsError("username", "password") && (
                                    <FormHelperText>
                                      <span
                                          aria-live="polite"
                                          dangerouslySetInnerHTML={{
                                              __html: kcSanitize(messagesPerField.getFirstError("username", "password"))
                                          }}
                                      />
                                    </FormHelperText>
                                  )}  
                                </FormControl>
                            </div>

                            <div className={kcClsx("kcFormGroupClass", "kcFormSettingClass")}>
                                <div id="kc-form-options">
                                    {realm.rememberMe && !usernameHidden && (
                                        <div className="checkbox">
                                            <label>
                                                <input
                                                    tabIndex={5}
                                                    id="rememberMe"
                                                    name="rememberMe"
                                                    type="checkbox"
                                                    defaultChecked={!!login.rememberMe}
                                                />{" "}
                                                {msg("rememberMe")}
                                            </label>
                                        </div>
                                    )}
                                </div>
                                <div className={kcClsx("kcFormOptionsWrapperClass")}>
                                    {realm.resetPasswordAllowed && (
                                        <span>
                                            <a tabIndex={6} href={url.loginResetCredentialsUrl}>
                                                {msg("doForgotPassword")}
                                            </a>
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div id="kc-form-buttons" className={kcClsx("kcFormGroupClass")}>
                                <input type="hidden" id="id-hidden-input" name="credentialId" value={auth.selectedCredential} />
                                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                <Button
                                    variant="contained"
                                    sx={{
                                        width: '100px',
                                        color: '#c9c9c9',
                                        backgroundColor: 'secondary.dark',
                                    }}
                                    tabIndex={7}
                                    type="submit"
                                    disabled={isLoginButtonDisabled}
                                    name="login"
                                >
                                    {msgStr("doLogIn")}
                                    </Button>
                                </Box>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </Template>
    );
}
