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

    let pinMap: DigitalPin[] = []
    let turningFactor = 5.5

    let leftMotor: MotionBitMotorChannel = MotionBitMotorChannel.M1
    let rightMotor: MotionBitMotorChannel = MotionBitMotorChannel.M2

    //% block="set left motor to $left and right motor to $right"
    //% group="Setup"
    export function setMotors(left: MotionBitMotorChannel, right: MotionBitMotorChannel): void {
        leftMotor = left
        rightMotor = right
    }

    //% block="set $pos IR sensor pin to $pin"
    //% group="Setup"
    export function setSensorPin(pos: SensorPosition, pin: DigitalPin): void {
        pinMap[pos] = pin
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

    //% block="turn left $angle degrees at speed $speed"
    //% group="Motion"
    export function turnLeftAngle(angle: number, speed: number): void {
        const time = angleToTime(angle)
        motionbit.runMotor(leftMotor, MotionBitMotorDirection.Backward, speed)
        motionbit.runMotor(rightMotor, MotionBitMotorDirection.Forward, speed)
        basic.pause(time)
        stopMotors()
    }

    //% block="turn right $angle degrees at speed $speed"
    //% group="Motion"
    export function turnRightAngle(angle: number, speed: number): void {
        const time = angleToTime(angle)
        motionbit.runMotor(leftMotor, MotionBitMotorDirection.Forward, speed)
        motionbit.runMotor(rightMotor, MotionBitMotorDirection.Backward, speed)
        basic.pause(time)
        stopMotors()
    }

    function angleToTime(angle: number): number {
        return angle * turningFactor
    }

    //% block="set turning factor to $factor"
    //% group="Setup"
    export function setTurningFactor(factor: number): void {
        turningFactor = factor
    }

    //% block="follow line at speed $speed"
    //% group="Line Following"
    export function followLine(speed: number): void {
        let left = sensorDetectsLine(SensorPosition.Left)
        let midLeft = sensorDetectsLine(SensorPosition.MidLeft)
        let center = sensorDetectsLine(SensorPosition.Center)
        let midRight = sensorDetectsLine(SensorPosition.MidRight)
        let right = sensorDetectsLine(SensorPosition.Right)

        if (left && midLeft) {
            turnRight(speed)
        } else if (right && midRight) {
            turnLeft(speed)
        } else if (center) {
            moveForward(speed)
        } else if (midLeft) {
            turnLeft(speed)
        } else if (midRight) {
            turnRight(speed)
        } else {
            stopMotors()
        }
    }
}