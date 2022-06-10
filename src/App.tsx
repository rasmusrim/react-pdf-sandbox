import React, {Fragment} from 'react';
import {createRoot} from 'react-dom/client';
import {PDFViewer} from "@react-pdf/renderer";
import Fractals from "@react-pdf/examples/src/fractals";
import GoTo from "@react-pdf/examples/src/goTo";
import Knobs from "@react-pdf/examples/src/knobs";
import MediaQueries from "@react-pdf/examples/src/mediaQueries";
import PageWrap from "@react-pdf/examples/src/pageWrap";
import Resume from "@react-pdf/examples/src/resume";
import Svg from "@react-pdf/examples/src/svg";
import Text from "@react-pdf/examples/src/text";
import {MyDocument} from "./MyDocument";

function App() {
    const allPdfs: React.FC[] = [MyDocument, GoTo, Knobs, MediaQueries, PageWrap, Resume, Svg, Text]

    return (<>{allPdfs.map(Pdf => <p><PDFViewer width={"800px"} height={"400px"}><Pdf/></PDFViewer></p>)}
        </>
    );
}

export default (): void => {
    const container = document.getElementById('root');
    const root = createRoot(container!);
    root.render(<App/>);
};


