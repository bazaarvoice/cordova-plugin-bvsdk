require 'calabash-android/calabash_steps'

#Global Variables
$count = 0
$limit = 10


#Story functions
Then(/^I press button with id "(.*?)"$/) do |buttonid|
   touch("SystemWebView css:'#{buttonid}'")
end
Then(/^I wait for app to load$/) do 
	wait_for_element_exists("* id:'button1'", timeout: 180)
end
# Then(/^I scroll until I see "(.*?)"$/) do |id|
# 	scroll_until_I_see(id)
# end
Then(/^I scroll down until I hit bottom$/) do
	scroll_up_while()
end

Then(/^I check number of products$/) do 
	numberOfProducts()
end

Then(/^I wait until "(.*?)" is ready$/) do |id|
	wait_for_element_exists("SystemWebView css:'#{id}'", timeout: 180)
end 

Then(/^I press Recommendations tab$/) do 
   touch("SystemWebView css:'.ion-android-checkmark-circle'")
end

Then(/^I press Conversations tab$/) do 
   touch("SystemWebView css:'.ion-chatbubbles'")
end

#General use methods
# def scroll_until_I_see(id)
	
#   until element_exists("SystemWebView css:'#{id}'") do
#     pan_up

#   end
# end


def scroll_up_while()
	while query("SystemWebView css:'#products', :class").last['calSavedIndex'] + 1 != $limit do
		pan_up
	end
end

def numberOfProducts()
	$count = $count + $limit
	puts "Expected amount of products: #{$count}" 
	puts "Actual amount of products: #{query("SystemWebView css:'#products', :class").last['calSavedIndex'] + 1} "   

	if query("SystemWebView css:'#products', :class").last['calSavedIndex'] + 1 != $count
		fail(msg="Number of products returned is incorrect.")	
	end
end
