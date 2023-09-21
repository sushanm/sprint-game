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

  const [showAvg, SetShowAvg] = useState(true);


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
        id: Math.random().toString(36).slice(2),
        votes: []
      })
    } else {
      tempData.issues = [{
        title: addNewIssue,
        status: 'added',
        id: Math.random().toString(36).slice(2),
        votes: []
      }]
    }

    for (let i = 0; i < tempData.issues.length; i++) {
      if (tempData.issues[i].status === 'added' || tempData.issues[i].status === 'wip') {
        tempData.issueForVoting = tempData.issues[i].id;
        SetIssueForVoting(tempData.issues[i]);
        SetSelectedFib(-1)
        break;
      }
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
          if (tempData.issueForVoting) {
            let index = tempData.issues.findIndex(item => item.id === tempData.issueForVoting)
            SetIssueForVoting(tempData.issues[index])
            if (tempData.issues[index].avgVote) {
              SetShowAvg(tempData.issues[index].avgVote)
            }
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
    const issueIndex = tempData.issues.findIndex(item => item.id === issueForVoting.id);

    if (tempData.issues[issueIndex].votes) {

      const userVotedIndex = tempData.issues[issueIndex].votes.findIndex(item => item.by === loggedInUserId)
      if (userVotedIndex < 0) {
        tempData.issues[issueIndex].votes.push({
          vote: fib,
          by: loggedInUserId
        })
      }
    } else {
      tempData.issues[issueIndex].votes = [{
        vote: fib,
        by: loggedInUserId
      }]
    }

    if (tempData.issues[issueIndex].votes.length > 0 && tempData.issues[issueIndex].votes.length <= tempData.users.length) {
      tempData.issues[issueIndex].status = "wip"
    }

    updateSprint(tempData);
  }



  const nextIssue = () => {
    let tempData = sprintDetail;
    for (let i = 0; i < tempData.issues.length; i++) {
      if (tempData.issues[i].status === 'added' || tempData.issues[i].status === 'wip') {
        tempData.issueForVoting = tempData.issues[i].id;
        break;
      }
    }
    updateSprint(tempData);
    SetShowAvg(true)
  }

  const calculateAvg = () => {
    let tempData = sprintDetail;
    const issueIndex = tempData.issues.findIndex(item => item.id === issueForVoting.id);

    SetShowAvg(false)
    tempData.issues[issueIndex].status = "done"

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
        <div className="col sprint-name">
        <h5>
        {sprintDetail.name}
        </h5>
        </div>
      </div>
      <div className="row">
        <div className="col-8">
          <div className="row">
            <div className="col-8">
              <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                <Form.Label>Current issue for Voting</Form.Label>
                <h4>
                  {issueForVoting.title}
                </h4>

              </Form.Group>
            </div>
            <div className="col-4">

              <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                <Form.Label>Average</Form.Label>

                <h5>
                  {
                    (sprintDetail.issues &&
                      sprintDetail.issues[sprintDetail.issues.findIndex(item => item.id === sprintDetail.issueForVoting)]) &&
                    sprintDetail.issues[sprintDetail.issues.findIndex(item => item.id === sprintDetail.issueForVoting)].avgVote
                  }
                </h5>
                {
                  (sprintDetail.issues &&
                    sprintDetail.issues[sprintDetail.issues.findIndex(item => item.id === sprintDetail.issueForVoting)] &&
                    !sprintDetail.issues[sprintDetail.issues.findIndex(item => item.id === sprintDetail.issueForVoting)].avgVote)
                  && <>
                    <img src="/sprint-game/assets/loading.gif" alt="banner" className="banner-image1" />
                  </>
                }
              </Form.Group>
              <div className="row">
                {
                  (loggedInUserId === sprintDetail.createdId) && (
                    (issueForVoting.votes && issueForVoting.votes.length === sprintDetail.users.length) &&
                    <>
                      <div className="col-6">

                        {
                          (sprintDetail.issues &&
                            sprintDetail.issues[sprintDetail.issues.findIndex(item => item.id === sprintDetail.issueForVoting)] &&
                            !sprintDetail.issues[sprintDetail.issues.findIndex(item => item.id === sprintDetail.issueForVoting)].avgVote)
                          && <>
                            <Button variant="secondary" onClick={() => calculateAvg()}>
                              Show Avg
                            </Button>
                          </>
                        }
                      </div>
                      <div className="col-6">
                      {
                          (sprintDetail.issues &&
                            sprintDetail.issues[sprintDetail.issues.findIndex(item => item.id === sprintDetail.issueForVoting)] &&
                            sprintDetail.issues[sprintDetail.issues.findIndex(item => item.id === sprintDetail.issueForVoting)].avgVote)
                          && <>
                            <Button variant="primary" onClick={() => nextIssue()}>
                              Next issue
                            </Button>
                          </>
                        }
                      </div>
                      <div className="col">

                      </div>
                    </>
                  )
                }
              </div>
            </div>
          </div>

          <div className="row fib-row">
            {
              sprintDetail.issues && sprintDetail.issueForVoting &&
              fibNo.map((fib, i) => {
                return (
                  <>
                    {
                      sprintDetail.issues.filter(item => item.id === sprintDetail.issueForVoting)[0].votes.filter(item => item.by === loggedInUserId).length === 0 &&
                      <div className="col fib-sel-div" key={fib} onClick={() => castVote(fib)}>
                        <span className={`fib-select-span`}>
                          {
                            fib
                          }
                        </span>
                      </div>
                    }
                    {
                      sprintDetail.issues.filter(item => item.id === sprintDetail.issueForVoting)[0].votes.filter(item => item.by === loggedInUserId).length > 0 &&
                      <div className="col fib-sel-div" key={fib} >
                        {
                          sprintDetail.issues.filter(item => item.id === sprintDetail.issueForVoting)[0].votes.filter(item => item.by === loggedInUserId)[0].vote === fib &&
                          <>
                            <span className={`fib-select-span fib-select-span-selected`}>
                              {
                                fib
                              }
                            </span>
                          </>
                        }
                        {
                          sprintDetail.issues.filter(item => item.id === sprintDetail.issueForVoting)[0].votes.filter(item => item.by === loggedInUserId)[0].vote !== fib &&
                          <>
                            <span className={`fib-select-span`}>
                              {
                                fib
                              }
                            </span>
                          </>
                        }
                      </div>
                    }
                  </>
                )
              })
            }
          </div>


          <div className="row user-row">

            {
              listOfUsers &&
              listOfUsers.map((user) => {
                return (
                  <div className="col-1 user-col" key={user.id}>
                    <div className="row">
                      <div className="col user-vote">
                        <span>
                          {
                            (sprintDetail.issues.filter(item => item.id === sprintDetail.issueForVoting).length > 0 &&
                              sprintDetail.issues.filter(item => item.id === sprintDetail.issueForVoting)[0].votes &&
                              sprintDetail.issues.filter(item => item.id === sprintDetail.issueForVoting)[0].votes.filter(item => item.by === user.id).length === 0) &&
                            <>
                              <img src="/sprint-game/assets/typing.gif" alt="banner" className="banner-image1" />
                            </>
                          }
                          {
                            (sprintDetail.issues.filter(item => item.id === sprintDetail.issueForVoting).length > 0 &&
                              sprintDetail.issues.filter(item => item.id === sprintDetail.issueForVoting)[0].votes &&
                              sprintDetail.issues.filter(item => item.id === sprintDetail.issueForVoting)[0].votes.filter(item => item.by === user.id).length > 0 && 
                              sprintDetail.issues.filter(item => item.id === sprintDetail.issueForVoting)[0].votes.filter(item => item.by === loggedInUserId).length > 0) &&
                           <span className='selected-vote'>
                           {
                            sprintDetail.issues.filter(item => item.id === sprintDetail.issueForVoting)[0].votes.filter(item => item.by === user.id)[0].vote
                           }
                           </span>
                          }
                          {
                            (sprintDetail.issues.filter(item => item.id === sprintDetail.issueForVoting).length > 0 &&
                              sprintDetail.issues.filter(item => item.id === sprintDetail.issueForVoting)[0].votes &&
                              sprintDetail.issues.filter(item => item.id === sprintDetail.issueForVoting)[0].votes.filter(item => item.by === user.id).length > 0 && 
                              sprintDetail.issues.filter(item => item.id === sprintDetail.issueForVoting)[0].votes.filter(item => item.by === loggedInUserId).length === 0) &&
                           <>
                           <img src="/sprint-game/assets/done.gif" alt="banner" className="banner-image1" />
                           </>
                          }
                        </span>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col">  {user.name}</div>
                    </div>
                  </div>
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
                    {
                      issue.status === 'done' &&
                      <div className="issue-row issue-done">
                        {issue.title}
                        <span className='casted-vote'>
                          {issue.avgVote}
                        </span>
                      </div>
                    }
                    {
                      (issue.status === 'added' && issue.id === issueForVoting.id) &&
                      <div className="issue-row issue-wip">
                        {issue.title}
                      </div>
                    }
                    {
                      (issue.status === 'wip') &&
                      <div className="issue-row issue-wip">
                        {issue.title}
                      </div>
                    }
                    {
                      (issue.status === 'added' && issue.id !== issueForVoting.id) &&
                      <div className="issue-row issue-added">
                        {issue.title}
                      </div>
                    }
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
                <div className="col-6">
                  <Button variant="primary" onClick={addNewIssueToList}>
                    Add New
                  </Button>
                </div>
              </div>
            </>
          }

        </div>


      </div>
    </Container>
  )
}

export default PlayGames
