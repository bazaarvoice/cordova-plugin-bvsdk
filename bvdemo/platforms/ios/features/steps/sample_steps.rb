#Global Variables
$count = 0
$limit = 10
$title = "null"

#Story functions
Given(/^the app has launched$/) do
  wait_for do
    !query("*").empty?
  end
end

Then(/^I press the Done button$/) do
  touch("label marked:'Done'")
end

# Then(/^I press button with id "(.*?)"$/) do |buttonid|
#    touch("webView css:'#{buttonid}'")
# end

Then(/^I press Recommendations tab$/) do 
   touch("webView css:'.ion-android-checkmark-circle'")
end

Then(/^I press Conversations tab$/) do 
   touch("webView css:'.ion-chatbubbles'")
end


Then(/^I scroll until I see "(.*?)"$/) do |id|
  scroll_until_I_see(id)
end

Then(/^I check number of products$/) do 
  numberOfProducts()
end

def scroll_until_I_see(id)
  
  until element_exists("webView css:'#{id}'") do
    swipe(:up)

  end
end

#General use methods
def numberOfProducts()
  
  while ($count != $limit) do

    if element_exists("webView css:'#products'")

      if $title == "null"
         $title = query("webView css:'#products'").last['textContent']
         $count = $count + 1
      end
      
      if $title != query("webView css:'#products'").last['textContent']
        $count = $count + 1
        $title = query("webView css:'#products'").last['textContent']
        
      end
      
    end

    swipe(:up)
  end
  puts "Expected amount of products: #{$limit}"
  puts "Actual amount of products: #{$limit}"
end




