<?php
$message = "PHP + HTML Sample!";
?>
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <title>PHPサンプル</title>
</head>
<body>
    <h1><?php echo $message; ?></h1>
    <p>サーバー時間：<?php echo date("Y-m-d H:i:s"); ?></p>
</body>
</html>
