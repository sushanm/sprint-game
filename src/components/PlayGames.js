import React, { useEffect, useState } from 'react'
import { useSearchParams } from "react-router-dom";
import loginService from '../service/login.service';
import { db } from "../firebase";
import { doc, onSnapshot } from "firebase/firestore";
import Container from 'react-bootstrap/Container';
import sprintServices from '../service/sprint.services';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

function PlayGames() {
  let [searchParams] = useSearchParams();
  const [sprintDetail, SetSprintDetails] = useState({});
  const [sprintId, SetSprintID] = useState({});
  const gameKey = searchParams.get("key");
  const fibNo = [0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144];
  const [loggedInUserName, SetUserName] = useState(loginService.getUserName());
  const [loggedInUserId, SetUserId] = useState(loginService.getUserId());

  const [listOfUsers, SetListOfUsers] = useState([])
  const [addNewIssue, SetNewIssue] = useState("")
  const [selectedFib, SetSelectedFib] = useState(-1)
  const [issueForVoting, SetIssueForVoting] = useState({});


  useEffect(() => {
    if (!isEmptyObj(gameKey)) {
      SetSprintID(gameKey)
    }
  }, [gameKey])

  window.addEventListener('storage', () => {
    SetUserName(loginService.getUserName())
    SetUserId(loginService.getUserId())
  })

  useEffect(() => {
    if (!isEmptyObj(sprintDetail)) {
      if (sprintDetail.users) {
        if (loggedInUserId) {
          let userIndex = sprintDetail.users.findIndex(item => item.id === loggedInUserId)
          if (userIndex === -1) {
            let sprintDetailsTemp = JSON.parse(JSON.stringify(sprintDetail));
            let tempUser = {
              name: loggedInUserName,
              id: loggedInUserId
            }
            sprintDetailsTemp.users.push(tempUser)
            updateSprint(sprintDetailsTemp)
          }
        }
      } else {
        let sprintDetailsTemp = JSON.parse(JSON.stringify(sprintDetail));
        let tempUser = {
          name: loggedInUserName,
          id: loggedInUserId
        }
        sprintDetailsTemp.users = [tempUser]
        updateSprint(sprintDetailsTemp)
      }
    }
  }, [sprintDetail])

  const updateSprint = async (data) => {
    await sprintServices.updateSprint(sprintId, data)
  }

  const addNewIssueToList = () => {
    let tempData = sprintDetail;
    if (tempData.issues) {
      tempData.issues.push({
        title: addNewIssue,
        status: 'added',
        id: Math.random().toString(36).slice(2)
      })
    } else {
      tempData.issues = [{
        title: addNewIssue,
        status: 'added',
        id: Math.random().toString(36).slice(2)
      }]
    }

    updateSprint(tempData);
    SetNewIssue("");
  }
  useEffect(() => {
    try {
      const unsub = onSnapshot(doc(db, "sprints", sprintId), (doc) => {
        SetSprintDetails(doc.data())

        let tempData = doc.data();
        if (tempData) {
          if (tempData.users) {
            SetListOfUsers(tempData.users)
          }
          if (tempData.issues) {
            tempData.issues.forEach(issue => {
              if (issue.status === 'added') {
                SetIssueForVoting(issue);
                return;
              }
            });
          }
        }
      });
    } catch (e) { }
  }, [sprintId, loggedInUserName])

  function isEmptyObj(obj) {
    for (const prop in obj) {
      if (Object.hasOwn(obj, prop)) {
        return false;
      }
    }
    return true;
  }

  const castVote = (fib) => {
    SetSelectedFib(fib)
    let tempData = sprintDetail;
    console.log(tempData)
    const issueIndex = tempData.issues.findIndex(item => item.id === issueForVoting.id);

    if (tempData.issues[issueIndex].votes) {
      tempData.issues.votes.push({
        vote: fib,
        by: loggedInUserId
      })
    } else {
      tempData.issues[issueIndex].votes = [{
        vote: fib,
        by: loggedInUserId
      }]
    }
    if (tempData.issues[issueIndex].votes.length === tempData.users.length) {
      tempData.issues[issueIndex].status = "done"
    }
    if (tempData.issues[issueIndex].votes.length > 0 && tempData.issues[issueIndex].votes.length < tempData.users.length) {
      tempData.issues[issueIndex].status = "wip"
    }
    let totalVote = 0
    if (tempData.issues[issueIndex].status === "done") {
      tempData.issues[issueIndex].votes.forEach(item => {
        totalVote = Number(totalVote) + Number(item.vote);
      });

      tempData.issues[issueIndex].avgVote = Math.round((totalVote / tempData.users.length) * 10) / 10
    }
    updateSprint(tempData);
  }

  return (
    <Container>
      <div className="row">
        <div className="col">
          {sprintDetail.name}
        </div>
      </div>
      <div className="row">
        <div className="col-8">
          <div className="row">
            <div className="col">
              <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                <Form.Label>Current issue for Voting</Form.Label>
                <p>
                  <h3>
                    {issueForVoting.title}
                  </h3>
                </p>
              </Form.Group>
            </div>
          </div>
          <div className="row">
            {
              fibNo.map((fib, i) => {
                return (
                  <>
                    {
                      selectedFib < 0 &&
                      <div className="col fib-sel-div" key={fib} onClick={() => castVote(fib)}>
                        <span className={`fib-select-span ${fib === selectedFib ? 'fib-select-span-selected' : ''}`}>
                          {
                            fib
                          }
                        </span>
                      </div>
                    }
                  </>
                )
              })
            }
          </div>
          <div className="row">
            {
              fibNo.map((fib, i) => {
                return (
                  <>{
                    (selectedFib > 0) &&
                    <div className="col fib-sel-div" key={fib} >
                      <span className={`fib-select-span ${fib === selectedFib ? 'fib-select-span-selected' : ''}`}>
                        {
                          fib
                        }
                      </span>
                    </div>
                  }
                  </>
                )
              })
            }
          </div>
        </div>
        <div className="col-4 border-l">
          <strong>Issues</strong>
          {
            sprintDetail.issues &&
            sprintDetail.issues.map((issue) => {
              return (
                <div className="row" key={issue.title}>
                  <div className="col">
                    <div className="issue-row">
                      {issue.title}
                    </div>

                  </div>
                </div>
              )
            })
          }
          {
            (loggedInUserId === sprintDetail.createdId) &&
            <>
              <div className="row">
                <div className="col">
                  <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                    <Form.Control as="textarea" rows={3} value={addNewIssue} onChange={(e) => SetNewIssue(e.target.value)} />
                  </Form.Group>
                </div>
              </div>
              <div className="row">
                <div className="col">
                  <Button variant="primary" onClick={addNewIssueToList}>
                    Add New
                  </Button>
                </div>
                <div className="col">
                  <Button variant="secondary" onClick={() => SetNewIssue("")}>
                    Cancel
                  </Button>
                </div>
              </div>
            </>
          }

        </div>
        <div className="col-2">
          {
            listOfUsers &&
            listOfUsers.map((user) => {
              return (
                <div className="row" key={user.id}>
                  {user.name}
                </div>
              )
            })
          }
        </div>

      </div>
    </Container>
  )
}

export default PlayGames
