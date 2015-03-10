'*********************************
'Post conversion script to fill the availdates field
'*********************************


'on error resume next



dim totalhours
dim currenthours
dim hours
dim alldates
dim alldatesfield
dim alldatesholiday
dim alldatesholidayfield
dim alldatestraining
dim alldatestrainingfield
dim alldatesproposed
dim alldatesproposedfield
dim mysql
dim Text
'----------------------------------------------------------
'Initialize, one month back, 2 years further
'----------------------------------------------------------
WebserviceLocation="http://localhost/CoveoSearch.asmx"

alldatesfield="mydateavail"
alldatesholidayfield="mydateavailholiday"
alldatestrainingfield="mydateavailtraining"
alldatesproposedfield="mydateavailproposed"
alldates=""
alldatesholiday=""
alldatestraining=""
alldatesproposed=""

Set hash = CreateObject ("Scripting.Dictionary")
Set hashProposed = CreateObject ("Scripting.Dictionary")
Set hashHoliday = CreateObject ("Scripting.Dictionary")
Set hashTraining = CreateObject ("Scripting.Dictionary")
hash.RemoveAll
hashProposed.RemoveAll
hashHoliday.RemoveAll

empidfield="EMPID"
tothoursfield="myTotHours"
avail1=CDate("30-06-2012")
avail2=CDate("20-08-2012")
Dim maxr,minr
Randomize
maxr=80
minr=4
		   currenthours=Int((maxr-minr+1)*Rnd+minr)

dateBegin=CDate(DateAdd("d",-50,Date))
dateEnd=CDate(DateAdd("yyyy",3,Date))
dateBeginP=CDate(DateAdd("d",10+currenthours,Date))
dateEndP=CDate(DateAdd("d",10+currenthours+15,Date))
dateBeginP2=CDate(DateAdd("d",60+currenthours,Date))
dateEndP2=CDate(DateAdd("d",60+currenthours+30,Date))

'dateEnd=CDate(DateAdd("d",200,Date))
totalhours=8
if (totalhours>0) then
		tot=datediff("d",dateBegin,dateEnd)
		for i = 0 to tot
		   
		thisdate2=dateAdd("d",i,dateBegin)

Randomize
		   currenthours=Int((maxr-minr+1)*Rnd+minr)
		   hours=totalhours-currenthours
		   hours=0
		   if (datediff("d",dateBeginP,thisdate2)>0 and datediff("d",dateEndP,thisdate2)<0) then
		        hours=8
		   end if
		   if (datediff("d",dateBeginP2,thisdate2)>0 and datediff("d",dateEndP2,thisdate2)<0) then
		        hours=8
		   end if
		    'Call PostConversion.Trace("Hours: "&dateAdd("d",i,dateBegin)&":"&hours&"-"&currenthours, 1)
		   if (hours>3) then
			  ' for i2=1 to hours
			  'No hours
		       Call PostConversion.Trace("ADDING HOURS: "&len(alldates), 1)
				   alldates=alldates&";"&Year(dateAdd("d",i,dateBegin))&PadDigits(Month(dateAdd("d",i,dateBegin)),2)&PadDigits(Day(dateAdd("d",i,dateBegin)),2)
		'Call PostConversion.Trace("Hours: "&alldates, 1)
			  ' next
		   end if

		   
		next

		Call PostConversion.Trace("Hours: "&len(alldates), 1)
		'Call PostConversion.Trace("Hours Holiday: "&alldatesholiday, 1)
	end if
	
	Call DocumentInfo.SetFieldValue(alldatesfield, alldates)
'44.514079, -98.053793
a=Array("1,60125;42,5469","55,116;24,288","67,6789;33,9304","-61,7894;17,086","4,851023;52,185673","-63,0721;18,2251","20,1414;40,8197","45,0399;40,0662","-69,0394;12,2092","17,9072;-11,9419","-78,08;24,7414","-88,6528;17,1929","33,4355;35,1325","10,4528;51,1657","9,51882;56,2745","30,2465;26,6964","26,0689;64,9524","1,71931;46,7177","-2,23831;54,3167","-95,844;37,1679","-66,5814;18,2016","-64,7363;17,7365","-115;54,4977","-126,553;54,1542","-95,4968;54,4964","-66,4161;46,3164","-60,2264;53,4935","-63,0422;45,22","-119,223;65,2881","-90,9078;69,4437","-84,7461;49,2676","-69,1055;53,8676","-105,68;54,4952","-136,803;64,8224","-149,988;63,0945","-86,6848;32,6073","-92,1312;34,76","-111,927;34,1684","-119,272;37,2765","-72,7574;41,5266","-77,0149;38,8932","-75,4192;39,1401","-81,5411;27,9756","-83,2272;32,6787","-155,437;19,5915","-93,386;41,939","-114,138;45,499","-89,2558;39,743","-86,4444;39,7662","-98,3202;38,4954","-85,6984;37,8216","-91,5219;30,9742","-71,7192;42,1869","-75,1468;38,4142","-69,0179;45,264","-86,2662;44,9973","-93,3572;46,4435","-92,4364;38,3077","-89,8743;32,5853","-110,037;46,6827","-80,0164;35,2223","-100,305;47,4644","-99,686;41,5016","-71,6353;44,0026","-74,7365;40,1423","-106,029;34,1666","-117,017;38,507","-76,5042;42,8536","-82,666;40,3586","-98,7189;35,3161","-120,514;44,1326","-77,6088;41,1094","-71,5945;41,6647","-80,9574;33,6108")
maxr=UBound(a)
minr=LBound(a)
Randomize
currentgps=((maxr-minr+1)*Rnd+minr)
		   currenthours=((maxr-minr+1)*Rnd+minr)
		   
		   currentex=(Rnd)
Call PostConversion.Trace("GPS1 "&CDbl(Split(a(currentgps),";")(0)), 1)
Call PostConversion.Trace("GPS2 "&CDbl(Split(a(currentgps),";")(0))+currentex, 1)

DocumentInfo.SetFieldValue "GPSLatitude", CDbl(Split(a(currentgps),";")(1))+currentex
DocumentInfo.SetFieldValue "GPSLongitude", CDbl(Split(a(currentgps),";")(0))-currentex
	
	
Function PadDigits(n, totalDigits) 

    PadDigits = Right(string(totalDigits,"0") & n, totalDigits) 

End Function 