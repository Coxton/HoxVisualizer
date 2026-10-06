import noise from "./gas/noise.glsl?raw";
import audio from "./gas/audio.glsl?raw";
import flow from "./gas/flow.glsl?raw";
import density from "./gas/density.glsl?raw";
import color from "./gas/color.glsl?raw";
import lighting from "./gas/lighting.glsl?raw";


const fragmentShader = `

uniform vec3 uCameraPosition;
uniform vec3 uLightPosition;
uniform vec3 uCorePosition;
uniform float uCoreIntensity;

uniform vec3 uOuterColor;
uniform vec3 uMidColor;
uniform vec3 uVioletColor;
uniform vec3 uInnerColor;

uniform float uTime;

uniform float uBass;
uniform float uLowMid;
uniform float uMid;
uniform float uHighMid;
uniform float uTreble;
uniform float uVocalIntensity;

varying vec3 vLocalPosition;


${noise}

${audio}

${flow}

${density}

${color}

${lighting}


void main()
{
    vec3 rayDirection =
        normalize(
            vLocalPosition -
            uCameraPosition
        );


    float rayLength =
        length(
            vLocalPosition -
            uCameraPosition
        );


    float audioIllumination =
        getAudioIllumination();


    float density =
        0.0;


    float emission =
        0.0;


    vec3 accumulatedColor =
        vec3(0.0);


    float accumulatedColorWeight =
        0.0;


    float stepSize =
        0.20;


    for (int i = 0; i < 24; i++)
    {
        float distance =
            float(i) *
            stepSize;


        if (distance >= rayLength)
        {
            break;
        }


        vec3 rayPosition =
            uCameraPosition +
            rayDirection *
            distance;


        vec3 nebulaPosition =
            uCorePosition +
            (
                rayPosition -
                uCorePosition
            ) *
            1.65;


        vec3 flowedPosition =
            flowPosition(
                nebulaPosition,
                uTime
            );


        float largeCloud;
        float mediumCloud;
        float fineCloud;
        float filamentNoise;


        getCloudData(
            flowedPosition,
            largeCloud,
            mediumCloud,
            fineCloud,
            filamentNoise
        );


        float sampleDensity =
            getCloudDensity(
                largeCloud,
                mediumCloud,
                fineCloud,
                filamentNoise
            );


        float coreDistance =
            length(
                rayPosition -
                uCorePosition
            );


        float illumination =
            getIllumination(
                rayPosition,
                coreDistance,
                audioIllumination
            );


        float sampleContribution =
            sampleDensity *
            illumination *
            0.013;


        density +=
            sampleContribution;


        float distanceFactor =
            1.0 -
            smoothstep(
                0.8,
                4.8,
                coreDistance
            );


        float localColorNoise =
            largeCloud * 0.42 +
            mediumCloud * 0.30 +
            fineCloud * 0.20 +
            filamentNoise * 0.08;


        vec3 sampleColor =
            getGasColor(
                distanceFactor,
                localColorNoise
            );


        accumulatedColor +=
            sampleColor *
            sampleContribution;


        accumulatedColorWeight +=
            sampleContribution;


        emission +=
            getEmission(
                sampleDensity,
                coreDistance
            );
    }


    density =
        clamp(
            density,
            0.0,
            0.72
        );


    emission =
        clamp(
            emission,
            0.0,
            0.8
        );


    vec3 gasColor =
        accumulatedColor /
        max(
            accumulatedColorWeight,
            0.0001
        );


    float audioGlow =
        getAudioGlow();


    gasColor *=
        audioGlow;


    gasColor *=
        1.0 +
        emission * 1.9;


    gl_FragColor =
        vec4(
            gasColor,
            density
        );
}


`;


export default fragmentShader;