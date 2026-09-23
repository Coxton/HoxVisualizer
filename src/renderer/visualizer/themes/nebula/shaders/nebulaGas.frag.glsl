
uniform vec3 uCameraPosition;
uniform vec3 uLightPosition;
uniform vec3 uCorePosition;
uniform float uCoreIntensity;

uniform vec3 uOuterColor;
uniform vec3 uMidColor;
uniform vec3 uInnerColor;

uniform float uTime;

uniform float uBass;
uniform float uLowMid;
uniform float uMid;
uniform float uVocalIntensity;

varying vec3 vLocalPosition;


float hash(vec3 p)
{
    p = fract(
        p * 0.3183099 +
        vec3(0.1, 0.2, 0.3)
    );

    p *= 17.0;

    return fract(
        p.x *
        p.y *
        p.z *
        (p.x + p.y + p.z)
    );
}


float noise(vec3 p)
{
    vec3 cell =
        floor(p);

    vec3 local =
        fract(p);

    local =
        local *
        local *
        (3.0 - 2.0 * local);


    float c000 =
        hash(cell + vec3(0.0, 0.0, 0.0));

    float c100 =
        hash(cell + vec3(1.0, 0.0, 0.0));

    float c010 =
        hash(cell + vec3(0.0, 1.0, 0.0));

    float c110 =
        hash(cell + vec3(1.0, 1.0, 0.0));

    float c001 =
        hash(cell + vec3(0.0, 0.0, 1.0));

    float c101 =
        hash(cell + vec3(1.0, 0.0, 1.0));

    float c011 =
        hash(cell + vec3(0.0, 1.0, 1.0));

    float c111 =
        hash(cell + vec3(1.0, 1.0, 1.0));


    float x00 =
        mix(
            c000,
            c100,
            local.x
        );

    float x10 =
        mix(
            c010,
            c110,
            local.x
        );

    float x01 =
        mix(
            c001,
            c101,
            local.x
        );

    float x11 =
        mix(
            c011,
            c111,
            local.x
        );


    float y0 =
        mix(
            x00,
            x10,
            local.y
        );

    float y1 =
        mix(
            x01,
            x11,
            local.y
        );


    return mix(
        y0,
        y1,
        local.z
    );
}


float nebulaNoise(vec3 p)
{
    float large =
        noise(
            p * 0.35
        );

    float medium =
        noise(
            p * 0.8
        );

    float fine =
        noise(
            p * 1.8
        );


    return
        large * 0.55 +
        medium * 0.30 +
        fine * 0.15;
}


vec3 flowPosition(
    vec3 position,
    float time
)
{
    vec3 flowedPosition =
        position;


    float largeFlow =
        time *
        (0.06 + uLowMid * 0.015);


    flowedPosition.x +=
        sin(
            position.z * 0.45 +
            largeFlow
        ) *
        0.35;


    flowedPosition.y +=
        sin(
            position.x * 0.35 +
            largeFlow * 0.8
        ) *
        0.20;


    flowedPosition.z +=
        cos(
            position.y * 0.40 +
            largeFlow * 0.9
        ) *
        0.30;


    float turbulence =
        time *
        (0.15 + uMid * 0.025);


    flowedPosition.x +=
        sin(
            position.y * 1.3 +
            turbulence
        ) *
        0.12;


    flowedPosition.y +=
        cos(
            position.z * 1.1 +
            turbulence * 0.8
        ) *
        0.10;


    flowedPosition.z +=
        sin(
            position.x * 1.5 +
            turbulence * 1.1
        ) *
        0.12;


    return flowedPosition;
}


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


    float density =
        0.0;

    float emissionAmount =
        0.0;

    float colorAmount =
        0.0;


    float stepSize =
        0.12;


    for (int i = 0; i < 48; i++)
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


        vec3 flowedPosition =
            flowPosition(
                rayPosition,
                uTime
            );


        /*
         * Bass slightly changes the scale,
         * but does not expand the entire nebula.
         */

        float largeScale =
            0.35 -
            uBass * 0.005;


        float largeCloud =
            noise(
                flowedPosition *
                largeScale
            );


        /*
         * Medium-scale structure
         * breaks the large clouds apart.
         */

        float mediumCloud =
            noise(
                flowedPosition *
                0.85
            );


        /*
         * Fine structure creates
         * smaller gas filaments.
         */

        float fineCloud =
            noise(
                flowedPosition *
                1.8
            );


        /*
         * Combine the different scales.
         */

        float gas =
            largeCloud * 0.55 +
            mediumCloud * 0.30 +
            fineCloud * 0.15;


        /*
         * Convert noise into actual gas.
         */

        float sampleDensity =
            smoothstep(
                0.43,
                0.67,
                gas
            );



        sampleDensity *=
            0.65 +
            mediumCloud * 0.6;


        /*
         * Core illumination.
         */

        float coreDistance =
            length(
                rayPosition -
                uCorePosition
            );


        float coreLight =
            1.0 -
            smoothstep(
                0.5,
                4.0,
                coreDistance
            );


        /*
         * Vocal intensity currently acts
         * as an approximation using the
         * mid/high-mid frequency response.
         */

        float vocalLight =
            uVocalIntensity *
            coreLight *
            2.0;


        /*
         * Existing external light.
         */

        float lightDistance =
            length(
                rayPosition -
                uLightPosition
            );


        float lightFalloff =
            1.0 -
            smoothstep(
                0.5,
                4.0,
                lightDistance
            );


        /*
         * Combine all illumination sources.
         */

        float illumination =
            0.10 +
            lightFalloff * 2.0 +
            coreLight * uCoreIntensity +
            vocalLight;


        /*
         * Bass and mid frequencies affect
         * the perceived density of the gas.
         */

        float audioDensity =
            1.0 +
            uBass * 0.15 +
            uMid * 0.20;


        density +=
            sampleDensity *
            illumination *
            audioDensity *
            0.005;


        /*
         * Core emission.
         */

        emissionAmount +=
            sampleDensity *
            vocalLight *
            0.012;


        /*
         * Vocal emission
         *
         * This is accumulated inside the
         * raymarch because vocalLight is
         * calculated per sample.
         */

        emissionAmount +=
            sampleDensity *
            vocalLight *
            0.02;


        colorAmount +=
            sampleDensity *
            0.025;
    }


    density =
        clamp(
            density,
            0.0,
            0.6
        );


    emissionAmount =
        clamp(
            emissionAmount,
            0.0,
            0.6
        );


    colorAmount =
        clamp(
            colorAmount,
            0.0,
            1.0
        );


    /*
     * Determine the gas color.
     */

    float colorFactor =
        smoothstep(
            0.08,
            0.35,
            colorAmount
        );


    vec3 gasColor;


    if (colorFactor < 0.5)
    {
        gasColor =
            mix(
                uOuterColor,
                uMidColor,
                colorFactor * 2.0
            );
    }
    else
    {
        gasColor =
            mix(
                uMidColor,
                uInnerColor,
                (colorFactor - 0.5) * 2.0
            );
    }


    /*
     * Core and vocal illumination
     * increase the final gas brightness.
     */

    gasColor *=
        1.0 +
        emissionAmount * 12.0;


    gl_FragColor =
        vec4(
            gasColor,
            density
        );
}

