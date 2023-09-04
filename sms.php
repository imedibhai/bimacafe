<?php

function generateNumericOTP($n)
{
  $generator = "1357902468";
  $result = "";
  for ($i = 1; $i <= $n; $i++) {
    $result .= substr($generator, rand() % strlen($generator), 1);
  }
  return $result;
}

// Main program
$n = 6;
$otp = generateNumericOTP($n);

      if(!empty($_POST['phone']))
      {
        $Phno=$_POST['phone'];
        $Msg="Your OTP is ".$otp." for validation of your mobile number. OTP will expire in 10 minutes. On expiry of time, please regenerate the OTP. PAINSB";
        $Password='beym1594BE';
        $SenderID='PAINSB';
        $UserID='PAINSURbiz';
        $EntityID='1501474560000044604';
        $TemplateID='1507165667386845861';
        function send_message($params)
        {
            $postData = '';
            foreach($params as $k => $v)
            {
              $postData .= $k . '='.$v.'&';
            }
            $postData = rtrim($postData, '&');
            $url='http://nimbusit.biz/api/SmsApi/SendBulkApi';

            $ch = curl_init();
            curl_setopt($ch,CURLOPT_URL,$url);
            curl_setopt($ch,CURLOPT_RETURNTRANSFER,true);
            curl_setopt($ch,CURLOPT_HEADER, false);
            curl_setopt($ch, CURLOPT_POST, count($postData));
            curl_setopt($ch, CURLOPT_POSTFIELDS, $postData);

            $output=curl_exec($ch);

            curl_close($ch);
            return $output;
        }
        $params = array(
           "Phno" => $Phno,
           "Msg" => urlencode($Msg),
           "Password" => $Password,
           "SenderID"=>$SenderID,
           "UserID"=>$UserID,
           "EntityID"=>$EntityID,
           "TemplateID"=>$TemplateID
        );

        if(send_message($params)['Status'] == true)
        {
          $data['success'] = true;
          $data['data'] = base64_encode($otp);;
        }
        else
        {
         $data['success'] = false;
        }

        echo  json_encode($data);
      }





        ?>
