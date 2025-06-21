//% color="#FF8800" weight=100 icon="\uf11b" block="MakerLine"
namespace MakerLine {

    export enum SensorPosition {
        //% block="Left"
        Left,
        //% block="Mid-Left"
        MidLeft,
        //% block="Center"
        Center,
        //% block="Mid-Right"
        MidRight,
        //% block="Right"
        Right
    }

    export enum MotorChannel {
        //% block="M1"
        M1,
        //% block="M2"
        M2,
        //% block="M3"
        M3,
        //% block="M4"
        M4
    }

    let pinMap: DigitalPin[] = [
        DigitalPin.P13,  // Left
        DigitalPin.P15,  // Mid-Left
        DigitalPin.P14,  // Center
        DigitalPin.P16,  // Mid-Right
        DigitalPin.P1    // Right
    ]

    let leftMotor = MotorChannel.M1
    let rightMotor = MotorChannel.M2

    //% block="set left motor to $left and right motor to $right"
    //% group="Setup"
    export function setMotors(left: MotorChannel, right: MotorChannel): void {
        leftMotor = left
        rightMotor = right
    }

    //% block="sensor $pos detects black line"
    //% group="Sensors"
    export function sensorDetectsLine(pos: SensorPosition): boolean {
        return pins.digitalReadPin(pinMap[pos]) == 0
    }

    //% block="move forward at speed $speed"
    //% group="Motion"
    export function moveForward(speed: number): void {
        motionbit.runMotor(leftMotor, MotionBitMotorDirection.Forward, speed)
        motionbit.runMotor(rightMotor, MotionBitMotorDirection.Forward, speed)
    }

    //% block="turn left at speed $speed"
    //% group="Motion"
    export function turnLeft(speed: number): void {
        motionbit.brakeMotor(leftMotor)
        motionbit.runMotor(rightMotor, MotionBitMotorDirection.Forward, speed)
    }

    //% block="turn right at speed $speed"
    //% group="Motion"
    export function turnRight(speed: number): void {
        motionbit.runMotor(leftMotor, MotionBitMotorDirection.Forward, speed)
        motionbit.brakeMotor(rightMotor)
    }

    //% block="stop motors"
    //% group="Motion"
    export function stopMotors(): void {
        motionbit.brakeMotor(leftMotor)
        motionbit.brakeMotor(rightMotor)
    }

    //% block="follow line at speed $speed"
    //% group="Line Following"
    export function followLine(speed: number): void {
        if (sensorDetectsLine(SensorPosition.Center)) {
            moveForward(speed)
        } else if (sensorDetectsLine(SensorPosition.MidLeft)) {
            turnLeft(speed)
        } else if (sensorDetectsLine(SensorPosition.MidRight)) {
            turnRight(speed)
        } else {
            stopMotors()
        }
    }
}