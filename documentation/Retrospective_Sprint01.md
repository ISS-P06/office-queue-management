TEMPLATE FOR RETROSPECTIVE (Team P06)
=====================================

The retrospective should include _at least_ the following
sections:

- [process measures](#process-measures)
- [quality measures](#quality-measures)
- [general assessment](#assessment)

## PROCESS MEASURES 

### Macro statistics

- Number of stories committed vs done: 4 - 0 (if we consider unit testing) , 4 - 3 (if we do not consider unit testing)
- Total points committed vs done: 21 - 0 (if we consider unit testing) , 21 - 18 (if we do not consider unit testing)
- Nr of hours planned vs spent (as a team): 28h planned vs 49h40m spent

**Remember**  a story is done ONLY if it fits the Definition of Done:
 
- Unit Tests passing
- Code review completed
- Code present on VCS
- End-to-End tests performed

### Detailed statistics

|                   Story                | # Tasks | Points | Hours est. | Hours actual |
|----------------------------------------|---------|--------|------------|--------------|
| _#0_                                   |    6    |    -   |     13h    |      19h     |
| s2106OQM-1 Configuration of the system |    2    |    8   |     4h     |      1d      |
| s2106OQM-2 Customer getting the ticket |    2    |    5   |     5h     |      12h     |
| s2106OQM-3 Serving the customer        |    2    |    5   |     4h     |     4h55m    |
| s2106OQM-4 Time estimation             |    -    |    3   |     -      |      -       |
| s2106OQM-5 Turn notification           |    -    |    8   |     -      |      -       |
| s2106OQM-6 Queue status                |    1    |    3   |     2h     |     5h45m    |
| s2106OQM-7 Statistics                  |    -    |    2   |     -      |      -       |
   

> place technical tasks corresponding to story `#0` and leave out story points (not applicable in this case)

- Hours per task (average, standard deviation): 
  - Avarage: 
    - Estimated=28h/13 tasks=2.15 hours/task
    - Actual=49h40m/13 tasks=3.82 hours/task; 
  - Standard_Deviation: 
    - Estimated=sqrt(((4-2.15)^2 + (1-2.15)^2 + (1-2.15)^2 + (2-2.15)^2 + (2-2.15)^2 + (3-2.15)^2 + (2-2.15)^2 + (2-2.15)^2 + (3-2.15)^2 + (2-2.15)^2 + (3-2.15)^2 + (1-2.15)^2 + (2-2.15)^2)/13)=0.919  
    - Actual=sqrt(((5-3.82)^2 + (1.5-3.82)^2 + (2.5-3.82)^2 + (4-3.82)^2 + (1-3.82)^2 + (5-3.82)^2 + (4-3.82)^2 + (4-3.82)^2 + (3-3.82)^2 + (9-3.82)^2 + (3.41-3.82)^2 + (1.5-3.82)^2 + (5.75-3.82)^2)/13)=2.05
 
- Total task estimation error ratio: sum of total hours estimation / sum of total hours spent from previous table: 28h/49h40m = 0.56

  
## QUALITY MEASURES 

- Unit Testing:
  - Total hours estimated: 3h
  - Total hours spent: 1.5h
  - Nr of automated unit test cases: 1
  - Coverage (if available)
- E2E testing:
  - Total hours estimated: 2.5h 
  - Total hours spent: 3h
- Code review 
  - Total hours estimated: 4h 
  - Total hours spent: 8h
- Technical Debt management:
  - Total hours estimated 
  - Total hours spent
  - Hours estimated for remediation by SonarQube
  - Hours estimated for remediation by SonarQube only for the selected and planned issues 
  - Hours spent on remediation 
  - debt ratio (as reported by SonarQube under "Measures-Maintainability")
  - rating for each quality characteristic reported in SonarQube under "Measures" (namely reliability, security, maintainability )
  


## ASSESSMENT

- What caused your errors in estimation (if any)?

Inexperience, not considering enough time for testing (unit testing in particular), underestimation of effort needed for committed tasks and stories (also given by unexpected issues encountered during development and setup of the system)

- What lessons did you learn (both positive and negative) in this sprint?

  1. We need to estimate enough time for testing and for unexpected events;
  2. Organization and communication are key elements during the sprint;

- Which improvement goals set in the previous retrospective were you able to achieve? 
  
- Which ones you were not able to achieve? Why?

- Improvement goals for the next sprint and how to achieve them (technical tasks, team coordination, etc.)
  
  1. Commit to less stories and tasks but do our best to estimate and complete them properly

  2. To keep GitHub repository and YouTrack board updated 

  3. To improve team coordination and communication

- One thing you are proud of as a Team!!

Everyone did their best to complete their tasks and help others when in need
