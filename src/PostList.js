import React, { Fragment, useState } from 'react';
import ListPagination from './ListPagination';
import { connect } from 'react-redux';
import { getPosts, setCurrentPage, saveMarkAsRead } from './modules/posts/actions';
import { createSelector } from "reselect";
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
  
const getPost = (state, props) => {
    try{
        //const id = props.id
        if(state.posts){
            const postsCount = Object.keys(state.posts.posts).length;
            const currentPage = state.posts.currentPage;
            const markAsRead = state.posts.markAsRead;
            const retryList = state.posts.retryList;
            let startIndex = (currentPage-1)*10;
            let lastIndex = (currentPage-1)*10 + 10;
            //console.log(state.posts, 'post list')
            let postList = Object.assign({}, state.posts.posts);
            if(postList){
                postList = state.posts.posts.slice(startIndex, lastIndex);
            }
            let finalList = {'posts' : postList, currentPage, postsCount, retryList, markAsReadArr: markAsRead};
            return finalList;
        } else {
            return {'posts' : []};
        }
    } catch(e) {
        console.log(e);
    }
    return {'posts' : []};
}
  
export const makeGetPostState = () => createSelector(
    [ getPost ],
    (post) => post
)
const makeMapStateToProps = () => {
    const getPostState = makeGetPostState()
    return (state, props) => getPostState(state, props)
}

const PostList = (props) => {
    //console.log(props, 'props in my posts');
    const { dispatch, posts, currentPage, postsCount, retryList, markAsReadArr } = props;
    //console.log(typeof posts);
    const [loader, setLoader] = useState(false);
    const [loadData, setLoadData] = useState(false);
  
    const handleLoadData = (event) => {
        // fetch posts and users list
        setLoader(true);
        //let posts = dispatch(getPosts());
        //let data = PostsList();
        //let posts = dispatch(setPosts(data));
        let posts = dispatch(getPosts());
        //console.log(posts, 'fetch posts');
        posts.then(() => setLoader(false));
        //dispatch(getUsers());
        //console.log(users, 'fetch users');
        setLoadData(true);
    }
  
    if (loader) {
        return (<div className="cr_loader">
            <svg 
            width='75'
            height='75'
            viewBox="25 25 50 50">
                <circle className="svg_stroke" cx="50" cy="50" r="20" fill="none" strokeWidth="2" strokeMiterlimit="10" />
            </svg>
        </div>)
    }
    
    const postDisplay = (row) => {
        let isRead = row.is_read === 1 || markAsReadArr.indexOf(row.id) > -1;
        return (
            <Fragment key={row.id}>
                <ListItem alignItems="flex-start" sx={{opacity: `${isRead ? 0.5 : 1}`, flexDirection: 'column'}}>
                <ListItemText primary={row.title} secondary={row.body}></ListItemText>
                <ListItemText sx={{display: 'flex', alignContent: 'center', flexDirection: 'column'}}>
                    <section>Author: {row.user.name}</section>
                    <section>
                        <div className="second-section">
                            <small>Date: {row.date}</small>
                            <small>
                                {
                                    retryList.indexOf(row.id) !== -1 ? <svg
                                        width="24"
                                        height="24"
                                        viewBox="0 0 30 30" >
                                        <g fill="none" fillRule="evenodd">
                                            <path
                                            className="svg_color"
                                            fill="#000"
                                            fillRule="nonzero"
                                            d="M15.016 5C9.484 5 5 9.477 5 15s4.484 10 10.016 10h.014c5.39 0 9.956-4.544 9.97-9.93.018-5.53-4.446-10.031-9.984-10.07zm4.225 16.85c-1.26.827-2.738 1.26-4.245 1.242-.158 0-.315-.005-.473-.014-1.855-.101-3.618-.843-4.986-2.098-1.443-1.311-2.364-3.099-2.594-5.034-.222-1.811.192-3.643 1.172-5.184l.437-.676L19.894 21.4l-.653.45zm2.532-2.45l-.445.638L9.952 8.67l.637-.444c1.482-.997 3.263-1.456 5.044-1.298 3.988.318 7.149 3.49 7.448 7.472.15 1.767-.312 3.532-1.308 5z" />
                                        </g>
                                    </svg> : ''
                                }
                                {
                                    !isRead ? 
                                    <Button variant="text" onClick={() => {markAsRead(row.id)}}>Mark as read</Button>
                                    : null
                                }
                                {
                                    retryList.indexOf(row.id) !== -1 ? <Button color="warning" onClick={(e) => {markAsRead(row.id)}}>Retry</Button> : ''
                                }
                            </small>
                        </div>
                    </section>
                </ListItemText>
            </ListItem>
            <Divider />
        </Fragment>);
    };
    
    var displayPosts = loadData && posts ? posts.map((row, i) => {
      return postDisplay(row);
    }) : ''
    
    const onSetPage = page => {
      dispatch(setCurrentPage(page));
    }
  
    const markAsRead = (id) => {
      // store post id to mark as read
      dispatch(saveMarkAsRead(id));
      //console.log(output, 'output of mark as read');
    }
  
    return (
      <Fragment>
        {
            (!loadData) ? <Button variant="outlined" sx={{width: '250px', height: '50px', position: 'absolute', top: '15%', left: '20%'}} onClick={handleLoadData}>Click to load</Button> : 
            <Fragment>
                <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                    {
                        displayPosts
                    }
                </List>
                <ListPagination
                    postsCount={postsCount}
                    currentPage={currentPage}
                    onSetPage={onSetPage} />
            </Fragment>
        }
      </Fragment>
    )
}

const mapDispatchToProps = (dispatch) => ({
    dispatch
});

export default connect(makeMapStateToProps, mapDispatchToProps)(PostList);