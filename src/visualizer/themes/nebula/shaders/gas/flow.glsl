vec3 flowPosition(
    vec3 position,
    float time
)
{
    vec3 flowedPosition = position;

    float slowTime =
        time * 0.045;

    float bassResponse =
        getBassResponse();

    float lowMidResponse =
        getLowMidResponse();

    float midResponse =
        getMidResponse();

    float highMidResponse =
        getHighMidResponse();

    float trebleResponse =
        getTrebleResponse();

    float vocalResponse =
        getVocalResponse();


    vec3 relativePosition =
        position -
        uCorePosition;

    float distanceFromCore =
        length(
            relativePosition
        );


    float coreInfluence =
        1.0 -
        smoothstep(
            1.5,
            7.0,
            distanceFromCore
        );


    float outerInfluence =
        smoothstep(
            2.0,
            7.0,
            distanceFromCore
        );


    float innerInfluence =
        1.0 -
        smoothstep(
            1.0,
            4.5,
            distanceFromCore
        );


    /*
     * BASS
     *
     * Large-scale movement.
     * Bass primarily affects the outer mass.
     */

    float bassMotion =
        bassResponse *
        0.75;

    float bassExpansion =
        1.0 +
        bassMotion *
        0.16 *
        coreInfluence;


    flowedPosition =
        uCorePosition +
        (
            flowedPosition -
            uCorePosition
        ) *
        bassExpansion;


    /*
     * LOW-MID
     *
     * Slow, broad rotational movement.
     */

    float orbitalStrength =
        0.16 +
        lowMidResponse *
        0.30 +
        bassResponse *
        0.06;


    float orbitalAngle =
        slowTime +
        distanceFromCore * 0.18;


    float orbitalSin =
        sin(
            orbitalAngle
        );

    float orbitalCos =
        cos(
            orbitalAngle
        );


    vec3 orbitalOffset =
        vec3(
            relativePosition.x * orbitalCos -
            relativePosition.z * orbitalSin -
            relativePosition.x,

            0.0,

            relativePosition.x * orbitalSin +
            relativePosition.z * orbitalCos -
            relativePosition.z
        );


    flowedPosition +=
        orbitalOffset *
        orbitalStrength *
        coreInfluence;


    /*
     * LOW-MID BROAD FLOW
     */

    flowedPosition.x +=
        sin(
            position.z * 0.28 +
            slowTime
        ) *
        (
            0.10 +
            lowMidResponse * 0.55
        );


    flowedPosition.y +=
        sin(
            position.x * 0.22 +
            slowTime * 0.70
        ) *
        (
            0.08 +
            lowMidResponse * 0.75
        );


    flowedPosition.z +=
        cos(
            position.y * 0.26 +
            slowTime * 0.75
        ) *
        (
            0.10 +
            lowMidResponse * 0.85
        );


    /*
     * MID
     *
     * Main cloud turbulence.
     * Higher spatial frequency than the low-mid movement.
     */

    float turbulenceTime =
        time * 0.11;


    float turbulenceX =
        sin(
            position.y * 1.35 +
            position.z * 0.65 +
            turbulenceTime
        );


    float turbulenceY =
        cos(
            position.z * 1.25 +
            position.x * 0.55 +
            turbulenceTime * 0.82
        );


    float turbulenceZ =
        sin(
            position.x * 1.45 +
            position.y * 0.60 +
            turbulenceTime * 0.94
        );


    flowedPosition.x +=
        turbulenceX *
        midResponse *
        1.45;


    flowedPosition.y +=
        turbulenceY *
        midResponse *
        1.25;


    flowedPosition.z +=
        turbulenceZ *
        midResponse *
        1.50;


    /*
     * HIGH-MID
     *
     * Fine twisting structures.
     */

    float highMidTime =
        time * 0.16;


    float highMidX =
        sin(
            position.y * 2.20 +
            position.z * 1.35 +
            highMidTime
        );


    float highMidY =
        cos(
            position.z * 2.00 +
            position.x * 1.45 +
            highMidTime * 0.87
        );


    float highMidZ =
        sin(
            position.x * 2.40 +
            position.y * 1.20 +
            highMidTime * 0.93
        );


    flowedPosition.x +=
        highMidX *
        highMidResponse *
        0.48 *
        (0.35 + innerInfluence * 0.65);


    flowedPosition.y +=
        highMidY *
        highMidResponse *
        0.55 *
        (0.35 + innerInfluence * 0.65);


    flowedPosition.z +=
        highMidZ *
        highMidResponse *
        0.52 *
        (0.35 + innerInfluence * 0.65);


    /*
     * VOCALS
     *
     * Very localized twisting layered on top.
     */

    float vocalFlow =
        sin(
            position.x * 2.40 +
            position.z * 1.80 +
            time * 0.18
        );


    float vocalTwist =
        cos(
            position.y * 2.20 +
            position.x * 1.60 +
            time * 0.15
        );


    flowedPosition.y +=
        vocalFlow *
        vocalResponse *
        0.55 *
        innerInfluence;


    flowedPosition.x +=
        vocalTwist *
        vocalResponse *
        0.60 *
        innerInfluence;


    /*
     * TREBLE
     *
     * Tiny, rapid spatial detail.
     *
     * Deliberately kept subtle so treble does not
     * turn into visual flicker.
     */

    float trebleTime =
        time * 0.22;


    float trebleX =
        sin(
            position.y * 4.20 +
            position.z * 2.60 +
            trebleTime
        );


    float trebleY =
        cos(
            position.z * 3.80 +
            position.x * 2.80 +
            trebleTime * 0.91
        );


    float trebleZ =
        sin(
            position.x * 4.50 +
            position.y * 2.40 +
            trebleTime * 1.07
        );


    flowedPosition.x +=
        trebleX *
        trebleResponse *
        0.14 *
        outerInfluence;


    flowedPosition.y +=
        trebleY *
        trebleResponse *
        0.12 *
        outerInfluence;


    flowedPosition.z +=
        trebleZ *
        trebleResponse *
        0.15 *
        outerInfluence;


    /*
     * SECONDARY LOW-MID WAVE
     */

    float secondaryWave =
        sin(
            position.x * 0.70 +
            position.z * 0.88 +
            time * 0.08
        );


    flowedPosition.y +=
        secondaryWave *
        lowMidResponse *
        0.45;


    return flowedPosition;
}