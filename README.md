# codegen-password

This is a REST Web Service developed with Express.js. 

Endpoint:
<ul>
  <li> / : Gives information like the author or the version of the software</li>
  <li> /generate : Generate a password based on some parameter you attach to the REST request</li>
</ul>

## Parameters for /generate

<ul>
  <li> "size" : you can choose the length of the password</li>
  <li> "type" : you can choose what characters include into the password, you can choose beetween these sets:
    <ul>
      <li>"numbers" -> "0123456789"</li>
      <li>"uppercase" -> "ABCDEFGHIJKLMNOPQRSTUVWXYZ"</li>
      <li>"lowercase" -> "abcdefghijklmnopqrstuvwxyz"</li>
      <li>"symbols" -> "@$!%*?&"</li>
    </ul>
  </li>
</ul>

## Example
{
	"size" : 10,
	"type": [
		"numbers",
		"uppercase",
    "lowercase"
	]
}

This request produce this output: "u2LsV97Dks".
