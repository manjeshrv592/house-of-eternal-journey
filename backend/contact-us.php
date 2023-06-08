<?php

$data = stripslashes(file_get_contents("php://input"));
$contactData = json_decode($data, true);
$contact['name'] = $contactData['firstName'];
$contact['email'] = $contactData['email'];
$contact['contactNum'] = $contactData['contactNum'];
$contact['link'] = $contactData['link'];





// LOcation of template file
$templateFile = "./template.php";


$swapVar = array(
 
  "{NAME}" => $contact['name'],
  "{EMAIL}" => $contact['email'],
  "{PHONE}" => $contact['contactNum'],
  "{LINK}" => $contact['link'],
);

if (file_exists($templateFile)) {
  $templateString = file_get_contents($templateFile);
} else {
  die('Unable to send Message');
}

// Search and replace string
foreach (array_keys($swapVar) as $key) {
  $templateString = str_replace($key, $swapVar[$key], $templateString);
}
?>

<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

require './PHPMailer/src/PHPMailer.php';
require './PHPMailer/src/SMTP.php';
require './PHPMailer/src/Exception.php';

//Create an instance; passing `true` enables exceptions
$mail = new PHPMailer(true);

try {
  //Server settings
  // $mail->SMTPDebug = SMTP::DEBUG_SERVER;                      //Enable verbose debug output
  $mail->isSMTP();                                            //Send using SMTP
  $mail->Host       = 'sandbox.smtp.mailtrap.io';             //Set the SMTP server to send through
  $mail->SMTPAuth   = true;                                   //Enable SMTP authentication
  $mail->Username   = 'a940b887046100';                     //SMTP username
  $mail->Password   = 'bf3c9c33371050';                               //SMTP password
  // $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;            //Enable implicit TLS encryption
  $mail->Port       = 2525;                                    //TCP port to connect to; use 587 if you have set `SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS`

  //Recipients
  $mail->setFrom('eternaljourney@example.com', 'House of Eternal Journey');
  $mail->addAddress('manjeshrv321@gmail.com');
  // $mail->addAddress('pankaj@phaico.com');     




  //Content
  $mail->isHTML(true);                                  //Set email format to HTML
  $mail->Subject = 'Email From house.theeternaljourney.com';

  $mail->Body = $templateString;


  $mail->AltBody = "Name: " . $contact["name"] . " \n\nEmail: " . $contact["email"] . "\n\Phone: " . $contact["contactNum"] . " \n\Media: " . $contact["link"];

  $mail->send();
 
  $response = ['status' => 'success', 'message' => 'Thank you for reaching out. We will connect with you at the earliest.'];
  echo json_encode($response);

} catch (Exception $e) {
  $response = ['status' => 'error', 'message' => 'Failed to send message. Please try after some time'];
  echo json_encode($response);
  echo $e;
}
