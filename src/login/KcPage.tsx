import { Suspense, lazy } from "react";
import type { ClassKey } from "keycloakify/login";
import type { KcContext } from "./KcContext";
import { useI18n } from "./i18n";
import DefaultPage from "keycloakify/login/DefaultPage";
import "./main.css";
import { tss } from "tss-react/mui"
import { createTheme, ThemeProvider } from "@mui/material/styles"
import { green } from "@mui/material/colors";

const UserProfileFormFields = lazy(
    () => import("keycloakify/login/UserProfileFormFields")
);

const Template = lazy(() => import("./Template"))

const DefaultTemplate = lazy (() => import("keycloakify/login/Template"))

const doMakeUserConfirmPassword = true;

const Login = lazy(() => import("./pages/Login"));

const theme = createTheme({
    palette: {
        mode: 'dark',
        text: {
          primary: '#c9c9c9' 
        },
        secondary: {
            light: green[700],
            main: green[800],
            dark: '#307a33',             
        }
    },
    typography: {
        fontFamily: 'Geist'
    }
})

export default function KcPage (props: { kcContext: KcContext }) {
    return (
        <ThemeProvider theme={theme} >
            <KcPageContextualized {...props} />
        </ThemeProvider >
    );
}

function KcPageContextualized(props: { kcContext: KcContext }) {
    const { kcContext } = props;

    const { i18n } = useI18n({ kcContext });

    const { classes } = useStyles();

    return (
        <Suspense>
            {(() => {
                switch (kcContext.pageId) {
                    case "login.ftl": return (
                        <Login
                            {...{ kcContext, i18n, classes }}
                            Template={Template}
                            doUseDefaultCss={true}
                        />
                    );
                    default:
                        return (
                            <DefaultPage
                                kcContext={kcContext}
                                i18n={i18n}
                                classes={classes}
                                Template={DefaultTemplate}
                                doUseDefaultCss={true}
                                UserProfileFormFields={UserProfileFormFields}
                                doMakeUserConfirmPassword={doMakeUserConfirmPassword}
                            />
                        );
                }
            })()}
        </Suspense>
    );
}

const useStyles = tss.create(({ theme }) => ({
    kcHtmlClass: {
        ":root": {
            colorScheme: "dark",
        }
    },
    kcBodyClass: {
        backgroundColor: theme.palette.background.default,
        background: 'radial-gradient(#2f465a, #011627)',
        color: theme.palette.text.primary
    }
}) satisfies { [key in ClassKey]?: unknown });

// const classes = {
//     kcHtmlClass: '',
//     kcBodyClass: ''
// } satisfies { [key in ClassKey]?: string };


//    background: radial-gradient(#2f465a, #011627);
//    background-repeat: no-repeat;
//    height: 100vh;
//    margin: 0;
//    font-family: 'system-ui', Arial, Courier, monospace;
//    font-size: 14px;
//    color: rgba(223, 220, 220, 0.82)