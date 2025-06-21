//% color="#FF8800" weight=100 icon="\uf11b" block="MakerLine"
namespace MakerLine {

    function angleToTime(angle: number, speed: number): number {
        // You can fine-tune this formula for your own robot
        const baseTime = 1000 // time in ms for 180 degrees at speed 100
        return (angle / 180) * (baseTime * (100 / speed))
    }

    //% block="turn right $angle degrees at speed $speed"
    //% group="Motion"
    export function turnRightAngle(angle: number, speed: number): void {
        const time = angleToTime(angle, speed)
        motionbit.runMotor(leftMotor, MotionBitMotorDirection.Forward, speed)
        motionbit.runMotor(rightMotor, MotionBitMotorDirection.Backward, speed)
        basic.pause(time)
        stopMotors()
    }



    //% block="turn left $angle degrees at speed $speed"
    //% group="Motion"
    export function turnLeftAngle(angle: number, speed: number): void {
        const time = angleToTime(angle, speed)
        motionbit.runMotor(leftMotor, MotionBitMotorDirection.Backward, speed)
        motionbit.runMotor(rightMotor, MotionBitMotorDirection.Forward, speed)
        basic.pause(time)
        stopMotors()
    }


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

    //% block="set $pos IR sensor pin to $pin"
    //% group="Setup"
    export function setSensorPin(pos: SensorPosition, pin: DigitalPin): void {
        pinMap[pos] = pin
    }

   

    let leftMotor: MotionBitMotorChannel = MotionBitMotorChannel.M1
    let rightMotor: MotionBitMotorChannel = MotionBitMotorChannel.M2

    //% block="set left motor to $left and right motor to $right"
    //% group="Setup"
    export function setMotors(left: MotionBitMotorChannel, right: MotionBitMotorChannel): void {
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