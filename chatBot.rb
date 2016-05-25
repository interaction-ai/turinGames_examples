require 'rest-client'
require 'json'

url = "https://turingames.fr/api/"

# You're username and token
username = ""
token = ""

toSend = {
	'name' => username,
	'token' => token
}.to_json
puts url + toSend
response = RestClient.post(url + "connect", toSend, :content_type => :json, :accept => :json
)
response = JSON.parse(response)
lobby = response["match"]

puts ("lobby: " + lobby)

toSend = {
	'name' => username,
	'token' => token,
	'lobby' => lobby
}.to_json
response = RestClient.post(url + "join", toSend, :content_type => :json, :accept => :json
)
response = JSON.parse(response)
message = response["answer"]
if message != nil then
	puts ("first message: " + message)
else
	message = "hello"
end
while response["query"] != "close" do
	toSend = {
		'name' => username,
		'token' => token,
		'lobby' => lobby,
		'msg' => message
	}.to_json
	response = RestClient.post(url + "answer", toSend, :content_type => :json, :accept => :json
)
	response = JSON.parse(response)
	message = response["answer"]
	puts (message)
end

puts ("this is the end ")
