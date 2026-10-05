vec3 flowPosition(
    vec3 position,
    float time
)
{
    vec3 flowedPosition =
        position;


    float slowTime =
        time * 0.045;


    float bassResponse =
        getBassResponse();


    float lowMidResponse =
        getLowMidResponse();


    float midResponse =
        getMidResponse();


    float vocalResponse =
        getVocalResponse();


    float bassMotion =
        bassResponse *
        0.75;


    float lowMidMotion =
        lowMidResponse *
        0.55;


    float midMotion =
        midResponse *
        0.42;


    float vocalMotion =
        vocalResponse *
        0.55;


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


    float orbitalStrength =
        0.18 +
        bassMotion * 0.10 +
        lowMidMotion * 0.08;


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


    float broadFlow =
        0.28 +
        bassMotion * 0.65 +
        lowMidMotion * 1.15;


    flowedPosition.x +=
        sin(
            position.z * 0.38 +
            slowTime
        ) *
        broadFlow;


    flowedPosition.y +=
        sin(
            position.x * 0.31 +
            slowTime * 0.75
        ) *
        (
            0.18 +
            lowMidMotion * 1.10
        );


    flowedPosition.z +=
        cos(
            position.y * 0.36 +
            slowTime * 0.82
        ) *
        (
            0.26 +
            lowMidMotion * 1.20
        );


    float turbulenceTime =
        time * 0.11;


    float turbulenceX =
        sin(
            position.y * 1.15 +
            position.z * 0.55 +
            turbulenceTime
        );


    float turbulenceY =
        cos(
            position.z * 1.05 +
            position.x * 0.45 +
            turbulenceTime * 0.82
        );


    float turbulenceZ =
        sin(
            position.x * 1.25 +
            position.y * 0.50 +
            turbulenceTime * 0.94
        );


    flowedPosition.x +=
        turbulenceX *
        (
            0.14 +
            midMotion * 1.35
        );


    flowedPosition.y +=
        turbulenceY *
        (
            0.12 +
            midMotion * 1.15
        );


    flowedPosition.z +=
        turbulenceZ *
        (
            0.15 +
            midMotion * 1.40
        );


    float secondaryWave =
        sin(
            position.x * 0.65 +
            position.z * 0.82 +
            time * 0.08
        );


    flowedPosition.y +=
        secondaryWave *
        (
            0.12 +
            lowMidMotion * 0.55
        );


    float vocalFlow =
        sin(
            position.x * 1.75 +
            position.z * 1.25 +
            time * 0.18
        );


    float vocalTwist =
        cos(
            position.y * 1.55 +
            position.x * 1.10 +
            time * 0.15
        );


    flowedPosition.y +=
        vocalFlow *
        vocalMotion;


    flowedPosition.x +=
        vocalTwist *
        vocalMotion *
        0.80;


    flowedPosition.z +=
        sin(
            position.y * 1.8 +
            position.z * 0.9 +
            time * 0.16
        ) *
        vocalMotion *
        0.65;


    float bassExpansion =
        1.0 +
        bassResponse *
        0.12 *
        coreInfluence;


    flowedPosition =
        uCorePosition +
        (
            flowedPosition -
            uCorePosition
        ) *
        bassExpansion;


    return flowedPosition;
}