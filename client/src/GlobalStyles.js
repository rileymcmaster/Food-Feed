import { createGlobalStyle } from "styled-components";

export default createGlobalStyle`
  :root {
      --primary-color: #5bb462;
      --secondary-color: #111820;
      --accent-bg-color: #D7ECEF;
      --page-horizontal-padding: 20px;
      --page-vertical-padding: 50px;
      --header-height: 50px;
      --max-content-width: 1200px;
      --heading-font-family: 'Rubik', sans-serif;
      --user-img-width: 120px;
      --user-img-margin: 5px;
      --nav-width: 250px;
      --page-height: 100vh;
    }
    *,
    *:before,
    *:after {
        box-sizing: border-box;
        -webkit-font-smoothing: antialiased;
        font-family: Arial, Helvetica, sans-serif; 
        font-size: 16px;
    }

    html, body, div,
    input, button, select, option,
    h1, h2, h3, h4, h5, h6, p,
    text {
    }

    html, body {
        max-width: 100vw;

    }
html, body, div, span, applet, object, iframe,
    h1, h2, h3, h4, h5, h6, p, blockquote, pre,
    a, abbr, acronym, address, big, cite, code,
    del, dfn, em, img, ins, kbd, q, s, samp,
    small, strike, strong, sub, sup, tt, var,
    b, u, i, center,
    dl, dt, dd, ol, ul, li,
    fieldset, form, label, legend,
    caption, tbody, tfoot, thead, tr, th, td,
    article, aside, canvas, details, embed,
    figure, figcaption, footer, header, hgroup,
    menu, nav, output, ruby, section, summary,
    time, mark, audio, video {
        margin: 0;
        padding: 0;
        border: 0;
        /* font-size: 100%; */
/* 
        vertical-align: baseline;
        box-sizing: border-box; */
    }
    /* HTML5 display-role reset for older browsers */
    article, aside, details, figcaption, figure,
    footer, header, hgroup, menu, nav, section {
        display: block;
    }
    body {
        line-height: 1;
    }
    ol, ul {
        list-style: none;
    }
    blockquote, q {
        quotes: none;
    }
    blockquote:before, blockquote:after,
    q:before, q:after {
        content: '';
        content: none;
    }
    h1, h2, h3 {

    }
`;
