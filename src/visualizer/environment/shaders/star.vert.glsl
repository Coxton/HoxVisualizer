attribute float aSize;
attribute float aBrightness;

attribute vec3 aMovement;
attribute float aPhase;

uniform float uTime;

varying float vBrightness;

void main()
{

    vec3 animatedPosition =
        position;

    animatedPosition +=
        aMovement *
        uTime *
        0.5;


    animatedPosition =
        mod(
            animatedPosition + 50.0,
            100.0
        ) -
        50.0;


    animatedPosition.x +=
        sin(
            uTime * 0.15 +
            aPhase
        ) *
        0.015;

    animatedPosition.y +=
        sin(
            uTime * 0.12 +
            aPhase * 1.37
        ) *
        0.015;

    animatedPosition.z +=
        cos(
            uTime * 0.10 +
            aPhase * 0.73
        ) *
        0.015;



    vec4 mvPosition =
        modelViewMatrix *
        vec4(
            animatedPosition,
            1.0
        );


    float distance =
        length(
            mvPosition.xyz
        );



    gl_Position =
        projectionMatrix *
        mvPosition;


    /*
     * Star size.
     */
    gl_PointSize =
        aSize *
        100.0;


    float twinkle =
        0.92 +
        sin(
            uTime * 0.8 +
            aPhase
        ) *
        0.08;


    /*
     * Combine base brightness with twinkle
     * and distance attenuation.
     */
    vBrightness =
        aBrightness *
        twinkle *
        clamp(
            1.0 -
            distance / 220.0,
            0.85,
            1.0
        );
}