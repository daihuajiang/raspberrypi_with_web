#!/usr/bin/evn python
# usage: python control_leds.py command (1, 2, 3)
# ex: blink the odd-number LEDs: python web_video_streaming.py 1 
# import the json and sys modules 
import json, sys
import time  

# import the RPi.GPIO module with setting its name as GPIO
import RPi.GPIO as GPIO  

# set the pin mode to be BCM
GPIO.setmode(GPIO.BCM)

# define the LED pins
LED_PINS = [17, 27, 22, 5, 6, 13, 19, 26]
LED_PIN1 = 17
LED_PIN2 = 27
LED_PIN3 = 22
LED_PIN4 = 5
LED_PIN5 = 6
LED_PIN6 = 13
LED_PIN7 = 19
LED_PIN8 = 26

# set the LED pins as output
GPIO.setup(LED_PINS, GPIO.OUT)

# blink the odd-number LEDS for 4 times
def Blink_Odd_LEDs():
	for count in range(0, 4, 1):
	    # turn the odd leds on
		GPIO.output(LED_PIN1, GPIO.HIGH)     
		GPIO.output(LED_PIN3, GPIO.HIGH)
		GPIO.output(LED_PIN5, GPIO.HIGH)
		GPIO.output(LED_PIN7, GPIO.HIGH)
		time.sleep(0.2)  # sleep for 1 second
		 # turn the odd leds off
		GPIO.output(LED_PIN1, GPIO.LOW)    
		GPIO.output(LED_PIN3, GPIO.LOW)
		GPIO.output(LED_PIN5, GPIO.LOW)
		GPIO.output(LED_PIN7, GPIO.LOW)
		time.sleep(0.2)  # sleep for 1 second
	
	# clear the setting of all IO pins
	GPIO. cleanup ( )

# blink the even-number LEDS for 4 times		
def Blink_Even_LEDs():
	for count in range(0, 4, 1):
	    # turn the even leds on
		GPIO.output(LED_PIN2, GPIO.HIGH)    
		GPIO.output(LED_PIN4, GPIO.HIGH)
		GPIO.output(LED_PIN6, GPIO.HIGH)
		GPIO.output(LED_PIN8, GPIO.HIGH)
		time.sleep(0.2)  # sleep for 1 second
		# turn the even leds off
		GPIO.output(LED_PIN2, GPIO.LOW)     
		GPIO.output(LED_PIN4, GPIO.LOW)
		GPIO.output(LED_PIN6, GPIO.LOW)
		GPIO.output(LED_PIN8, GPIO.LOW)
		time.sleep(0.2)  # sleep for 1 second
		
	# clear the setting of all IO pins
	GPIO. cleanup ( )

# PWM LEDs for 5 seconds
def PWM_LEDs():
	# generate the pwm objects of LED pins with frequency=50Hz
	pwm1 = GPIO.PWM(LED_PIN1, 50)
	pwm2 = GPIO.PWM(LED_PIN2, 50)
	pwm3 = GPIO.PWM(LED_PIN3, 50)
	pwm4 = GPIO.PWM(LED_PIN4, 50)
	pwm5 = GPIO.PWM(LED_PIN5, 50)
	pwm6 = GPIO.PWM(LED_PIN6, 50)
	pwm7 = GPIO.PWM(LED_PIN7, 50)
	pwm8 = GPIO.PWM(LED_PIN8, 50)

	# start the pwm objects with dutycycle starting from 0
	pwm1.start(0)
	pwm2.start(0)
	pwm3.start(0)
	pwm4.start(0)
	pwm5.start(0)
	pwm6.start(0)
	pwm7.start(0)
	pwm8.start(0)
	
	for count in range(0, 4, 1):
		# do loop to increase the dutycycle of the pwm objects by 5% each loop
		for dc in range(0, 101, 10):  
			pwm1.ChangeDutyCycle(dc)
			pwm2.ChangeDutyCycle(dc)
			pwm3.ChangeDutyCycle(dc)
			pwm4.ChangeDutyCycle(dc)
			pwm5.ChangeDutyCycle(dc)
			pwm6.ChangeDutyCycle(dc)
			pwm7.ChangeDutyCycle(dc)
			pwm8.ChangeDutyCycle(dc)
			time.sleep(0.05) # sleep 0.1 second
		 # do loop to decrease the dutycycle of the pwm objects by 5% each loop
		for dc in range(100, -1, -10):
			pwm1.ChangeDutyCycle(dc)
			pwm2.ChangeDutyCycle(dc)
			pwm3.ChangeDutyCycle(dc)
			pwm4.ChangeDutyCycle(dc)
			pwm5.ChangeDutyCycle(dc)
			pwm6.ChangeDutyCycle(dc)
			pwm7.ChangeDutyCycle(dc)
			pwm8.ChangeDutyCycle(dc)
			time.sleep(0.05) # sleep 0.1 second

	# stop the operation of the pwm objects		
	pwm1.stop
	pwm2.stop
	pwm3.stop
	pwm4.stop
	pwm5.stop
	pwm6.stop
	pwm7.stop
	pwm8.stop
	
	# clear the setting of all IO pins
	GPIO. cleanup ( )

# Run the LEDS for 3 times
def Run_LEDs():	
	for count in range(0, 2, 1):
		for i in range(0,8,1):
			# turn the the target led on
			GPIO.output(LED_PINS[i], GPIO.HIGH)    
			time.sleep(0.05)  # sleep for 0.2 seconds
			# turn all leds off
			GPIO.output(LED_PINS, GPIO.LOW)
			time.sleep(0.05)  # sleep for 1 second
		
		for i in range(6,-1,-1):
			# turn the the target led on
			GPIO.output(LED_PINS[i], GPIO.HIGH)    
			time.sleep(0.05)  # sleep for 0.2 seconds
			# turn all leds off
			GPIO.output(LED_PINS, GPIO.LOW)
			time.sleep(0.05)  # sleep for 1 second
			
	# clear the setting of all IO pins
	GPIO. cleanup ( )
	
# get the command for control the LEDs  
command = sys.argv[1]

if(command=="1"): 
    # a Python object (dict):
	x = {"message":u"奇數LED燈正在閃爍!"}
	# convert into JSON:
	y = json.dumps(x)
	# the result is a JSON string:
	print(y)
	Blink_Odd_LEDs()	
elif(command=="2"):
    # a Python object (dict):
	x = {"message":u"偶數LED燈正在閃爍!"}
	# convert into JSON:
	y = json.dumps(x)
	# the result is a JSON string:
	print(y)
	Blink_Even_LEDs()
elif(command=="3"):
	# a Python object (dict):  
	x = {"message":u"正用PWM驅動LED燈!"}
	# convert into JSON:
	y = json.dumps(x)
	# the result is a JSON string:
	print(y)
	PWM_LEDs()
	
elif(command=="4"):
	# a Python object (dict):
	x = {"message":u"LED正在執行跑馬燈!"}
	# convert into JSON:
	y = json.dumps(x)
	# the result is a JSON string:
	print(y)
	Run_LEDs()
else:
	# a Python object (dict):
	x = {"message":u"無效的命令!"}
	# convert into JSON:
	y = json.dumps(x)
	# the result is a JSON string:
	print(y)
	
