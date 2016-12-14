Feature: BVSDK Demo App

@bvsdk_setup_test
Scenario: As a user, I want BVSDK to be setup successfully
  Given the app has launched 
  Then I should see "BVSDK has been built successfully."
  Then I press the Done button

@recommendations_test
  Scenario: As a user, I want to get new recommendations
    Given the app has launched 
    Then I should see "BVSDK has been built successfully."
    Then I press the Done button
    Then I wait for 1 seconds
    Then I press Recommendations tab
    Then I wait for 1 seconds
    Then I check number of products

@conversations_test  
  Scenario: As a user, I want to see conversations
    Given the app has launched 
    Then I should see "BVSDK has been built successfully."
    Then I press the Done button
    Then I wait for 1 seconds
    Then I press Conversations tab
    Then I wait for 3 seconds
    