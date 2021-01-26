import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
    palette: {
        type: "dark",
        primary: {
            main: '#a7ffeb',
          },
          secondary: {
            main: '#84ffff',
          },
    },
    typography: {
        button: {
            textTransform: "none"
        }
    }
});

export default theme
