<?php error_reporting(E_ALL);
ini_set('display_errors', '1');


if(base64_decode($_POST['code']) == $_POST['otp'])
{
$name = $_POST['name'];
$adult = $_POST['adult'];
$child = $_POST['child'];
$dob = $_POST['dob'];
$phone = $_POST['phone'];
$city = $_POST['city'];
$to = 'enquiry@bimacafe.co.in, himanshu@painsurancebrokers.in, tracker@nybblehost.com';

// subject
$subject = 'New Enquiry for Health Insurance';

// message
$message = '
<html>
<head>
  <title>Health Insurance lead</title>
</head>
<body>
  <tr>
    <td>
    <p><b>Name:  </b>'.$name.'</p>
    <p><b>DOB:  </b>'.$dob.'</p>
    <p><b>City:  </b>'.$city.'</p>
    <p><b>Phone:  </b>'.$phone.'</p>
    <p><b>Adults:  </b>'.$adult.'</p>
    <p><b>Child:  </b>'.$child.'</p>
    </td>
    </tr>
  </table>
</body>
</html>
';

// To send HTML mail, the Content-type header must be set
$headers  = 'MIME-Version: 1.0' . "\r\n";
$headers .= 'Content-type: text/html; charset=iso-8859-1' . "\r\n";

// Additional headers
// $headers .= 'To: Mary <mary@example.com>' . "\r\n";

// Mail it
$res = mail($to, $subject, $message, $headers);
if($res)
{
$data['success'] = true;
$data['success_message'] = "Form submitted successfully";
}
else
{
$data['formErrors'] = true;
$data['errors'] = "Form is not submit";
}
}
else{
  $data['formErrors'] = true;
  $data['errors'] = "Otp does not match";
}

echo  json_encode($data);
?>
