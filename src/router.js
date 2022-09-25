import { useState, useEffect } from "react";
import Header from "./components/header/header";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import Query from "./pages/query/query";
import chart from "./pages/chart/chart";
import Sidebar from "./components/sidebar/sidebar";
import { useContext } from "react";
import { DataContext } from "./context/context";
import { Button } from "react-bootstrap";
import LoadingSpinner from "./components/loadingSpinner/loadingSpinner";
export default function Router() {
  const { loading, error } = useContext(DataContext);

  const [toggleSidebar, setToggleSidebar] = useState(true);
  const [viewWidth, setViewWidth] = useState();

  const sideBarToggler = toggleSidebar && <Sidebar />;

  useEffect(() => {
    if (!viewWidth) {
      setViewWidth(window.innerWidth);
    }

    window.addEventListener("resize", () => {
      setViewWidth(window.innerWidth);
    });

    if (viewWidth < "600") {
      setToggleSidebar(false);
    }

    if (viewWidth > "600") {
      setToggleSidebar(true);
    }

    return () => {
      window.removeEventListener("resize", () => {
        setViewWidth(window.innerWidth);
      });
    };
  }, [viewWidth]);

  return (
    <BrowserRouter>
      <Header />
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <p>oops sorry,something went wrong</p>
      ) : (
        <>
          {viewWidth < "600" && (
            <>
              <style type="text/css">
                {`
                  .btn-tag {
                    background-color: black;
                    font-size:20px;
                    display:block;
                    width:50%;
                    margin: 5% auto;
                    color: white;
                    border-radius: 5px;
                    border: none;
                  }

                  .btn-tag:hover{
                    background-color: yellow;
                    color:black;
                  }
                `}
              </style>
              <Button
                variant="tag"
                onClick={() => setToggleSidebar(!toggleSidebar)}
              >
                Tags
              </Button>
            </>
          )}
          <div className=" d-flex md search">
            {viewWidth > "600" ? <Sidebar /> : sideBarToggler}
            <Switch>
              <Route path="/search" component={Query} />
              <Route path="/chart" component={chart} />
              <Route path="/">
                <Redirect to="/search" />
              </Route>
            </Switch>
          </div>
        </>
      )}
    </BrowserRouter>
  );
}
