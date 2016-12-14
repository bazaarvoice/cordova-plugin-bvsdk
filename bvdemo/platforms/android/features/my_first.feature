Feature: BVSDK Demo App

@bvsdk_setup_test
  Scenario: As a user, I want BVSDK to be setup successfully
    Then I wait for app to load
    Given I see "BVSDK has been built successfully."
    Then I press the "Done" button

@recommendations_test
    Scenario: As a user, I want to see recommendations
    Then I wait for app to load
    Given I press the "Done" button 
    Then I wait until ".tab-title" is ready

@conversations_test  
  Scenario: As a user, I want to see conversations
    Then I wait for app to load
    Given I press the "Done" button 
    Then I wait until ".tab-title" is ready
    Then I press Conversations tab
    Then I wait for 3 seconds


