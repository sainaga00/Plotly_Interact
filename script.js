// Generate Random Data
function generateData() {
    const x1 = [];
    const x2 = [];
    const y = [];
    for (let i = 0; i < 100; i++) {
        x1.push(Math.random() * 20 - 10);
        x2.push(Math.random() * 20 - 10);
        y.push(3 * x1[i] + 2 * x2[i] + (Math.random() * 10 - 5));
    }
    return { x1, x2, y };
}

const data = generateData();

// Plotly scatter plot
function updateScatterPlot(beta1, beta2) {
    const y_pred = data.x1.map((x1, i) => beta1 * x1 + beta2 * data.x2[i]);
    const scatterData = [
        {
            x: y_pred,
            y: data.y,
            mode: 'markers',
            type: 'scatter',
            marker: { size: 8, color: 'navy' }
        },
        {
            x: [-30, 30],
            y: [-30, 30],
            mode: 'lines',
            line: { dash: 'dash', color: 'red' }
        }
    ];
    const layout = {
        title: `Scatter Plot (Beta1: ${beta1}, Beta2: ${beta2})`,
        xaxis: { title: 'Predicted Values' },
        yaxis: { title: 'Actual Values' },
        width: 800,
        height: 800,
        plot_bgcolor: '#f0f0f0',
        paper_bgcolor: '#ffffff'
    };
    Plotly.newPlot('scatter-plot', scatterData, layout);
}

// Plotly 3D surface plot
function computeRMSE(beta1, beta2) {
    let sumSqError = 0;
    for (let i = 0; i < data.x1.length; i++) {
        const yPred = beta1 * data.x1[i] + beta2 * data.x2[i];
        sumSqError += (data.y[i] - yPred) ** 2;
    }
    return Math.sqrt(sumSqError / data.x1.length);
}

// Update Surface Plot 
function updateSurfacePlot(beta1, beta2) {
    const beta1Range = Plotly.d3.range(-10, 10.5, 0.5);
    const beta2Range = Plotly.d3.range(-10, 10.5, 0.5);

    const z = [];
    for (let i = 0; i < beta1Range.length; i++) {
        const row = [];
        for (let j = 0; j < beta2Range.length; j++) {
            row.push(computeRMSE(beta1Range[i], beta2Range[j]));
        }
        z.push(row);
    }

    const surfaceData = [
        {
            z: z,
            x: beta1Range,
            y: beta2Range,
            type: 'surface',
            colorscale: 'RdBu',
            opacity: 0.5,
            uirevision: 'surfacePlot' 
        },
        {
            x: [beta1],
            y: [beta2],
            z: [computeRMSE(beta1, beta2)],
            mode: 'markers',
            type: 'scatter3d',
            marker: { size: 10, color: 'red' }
        }
    ];

    const layout = {
        title: 'RMSE Surface Plot',
        scene: {
            xaxis: { title: 'Beta1' },
            yaxis: { title: 'Beta2' },
            zaxis: { title: 'RMSE' },
        },
        width: 800,
        height: 800,
        uirevision: 'surfacePlot' 
    };

    Plotly.react('threejs-plot', surfaceData, layout);
}


const initialBeta1 = 3;
const initialBeta2 = 2;
updateScatterPlot(initialBeta1, initialBeta2);
updateSurfacePlot(initialBeta1, initialBeta2);


const beta1Slider = document.getElementById('beta1Slider');
const beta2Slider = document.getElementById('beta2Slider');

// Update Plot w.r.t Slider Input values
function updatePlotsAndInputs() {
    const beta1 = parseFloat(beta1Slider.value);
    const beta2 = parseFloat(beta2Slider.value);

    document.getElementById('beta1Input').value = beta1;
    document.getElementById('beta2Input').value = beta2;

    updateScatterPlot(beta1, beta2);
    updateSurfacePlot(beta1, beta2);
}

beta1Slider.addEventListener('input', updatePlotsAndInputs);
beta2Slider.addEventListener('input', updatePlotsAndInputs);

document.getElementById('beta1Input').addEventListener('input', () => {
    beta1Slider.value = document.getElementById('beta1Input').value;
    updatePlotsAndInputs();
});

document.getElementById('beta2Input').addEventListener('input', () => {
    beta2Slider.value = document.getElementById('beta2Input').value;
    updatePlotsAndInputs();
});

updatePlotsAndInputs();