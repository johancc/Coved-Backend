import React, { Component, useContext } from "react";
import { Router } from "@reach/router";

import { UserContext } from "../../providers/UserProvider";
import { Redirect } from "@reach/router";

class ProtectedPage extends Component {
    static contextType = UserContext;
    render() {
        const Component = this.props.component;
        return (
            <>  
                {this.context ? <Component user={this.context.user}/> : <Redirect to="/auth"/>}
            </>
        )
    }
}

export default ProtectedPage;
