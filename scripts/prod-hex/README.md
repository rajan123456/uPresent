# Deployment Documentation

The following document describes steps to setup and install on an [AWS EKS](https://aws.amazon.com/eks/) cluster.

## Getting Started

- Setting up the management server

  A remote machine is used to manage EKS resources. This could be any workstation or a build server. In order to perform administrative tasks on EKS, the following installations are necessary:

  - [awscli](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html)
  - [eksctl](https://github.com/weaveworks/eksctl#installation)
  - [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/)

  The below instructions are specific to steps for a Linux management server. However, the reference links provided above can be refered to for other platforms.

1. Install and Configure awscli

   a. Ensure python and pip are installed.

   ```
   pip3 --version
   ```

   b. Install AWS CLI using pip3

   ```
   pip3 install awscli --upgrade --user
   ```

   c. Verify the installation was successful

   ```
   aws --version
   ```

   d. Configure awscli to set AWS credentials. You should set the AWS Access Key ID, AWS Secret Access Key and the Default region name when prompted to.

   ```
   aws configure
   ```

2. Install eksctl

   a. Download and extract the latest release of eksctl with the following command.

   ```
   curl --silent --location "https://github.com/weaveworks/eksctl/releases/latest/download/eksctl_$(uname -s)_amd64.tar.gz" | tar xz -C /tmp
   ```

   b. Move the extracted binary to /usr/local/bin.

   ```
   sudo mv /tmp/eksctl /usr/local/bin
   ```

   c. Test that your installation was successful with the following command.

   ```
   eksctl version
   ```

3. Install kubectl

   a. Download the latest release with the command:

   ```
   curl -LO https://storage.googleapis.com/kubernetes-release/release/`curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt`/bin/linux/amd64/kubectl
   ```

   b. Make the kubectl binary executable.

   ```
   chmod +x ./kubectl
   ```

   c. Move the binary in to your PATH.

   ```
   sudo mv ./kubectl /usr/local/bin/kubectl
   ```

   d. Test to ensure the installation was successful:

   ```
   kubectl version --client
   ```

- Provisioning the eks cluster

  1. Below command can be used to provision a new eks cluster:

  ```
  eksctl create cluster --name prod-hex --region us-east-1 --zones "us-east-1a","us-east-1c" --nodegroup-name prod-hex-workers --node-type t3.medium --nodes 3 --nodes-min 1 --nodes-max 4 --ssh-access --ssh-public-key iss-dev.pub --managed
  ```

  **NOTE:** The above command usually takes 15 minutes to complete.

  2. Verify the cluster is up and accessible.

  ```
  kubectl get svc
  ```

  **Explanation:**

  The above command creates a new eks cluster called **prod-hex** in the **us-east-1** region, targetting the **us-east-1a** and **us-east-1c** availability zones.
  The cluster will manage EC2 machines in the **prod-hex-workers** nodegroup, and each EC2 machine would be of type **t3.medium**.
  The number of nodes desired in the cluster are **3**, and the kubernetes master can reduce them down to **1** or scale them up to **4** when needed.
  EC2 machines part of the nodegroup can be accessed using ssh using the full pem key, from which the public key **iss-dev.pub** is extracted.
  This command also sets up the kubectl context on the management machine, so that future kubectl commands can be run directly.

- Setting up kubectl context on another machine.

  If the cluster was provisioned previously from a different machine, and kubectl commands need to be executed from a different machine, the kubeconfig needs to be setup on the new machine. Below commands should be followed for setting up a new kubeconfig.

  1. Ensure awscli is installed and configured
  2. Run the below command to setup the kubeconfig:

  ```
  aws eks --region us-east-1 update-kubeconfig --name prod-hex
  ```

## Pre-Installation

This sectional is optional but recommended.
Before application installation, it is good to install certain services in order to better manage the cluster.

- [Installing the kubernetes-metrics-server](https://docs.aws.amazon.com/eks/latest/userguide/metrics-server.html)

1. Ensure the following linux packages are installed on the management server: curl, tar, gzip, and jq. Else, install them.
2. Run the below commands to install the Kubernetes Metrics server:

```
DOWNLOAD_URL=$(curl -Ls "https://api.github.com/repos/kubernetes-sigs/metrics-server/releases/latest" | jq -r .tarball_url)
DOWNLOAD_VERSION=$(grep -o '[^/v]*$' <<< $DOWNLOAD_URL)
curl -Ls $DOWNLOAD_URL -o metrics-server-$DOWNLOAD_VERSION.tar.gz
mkdir metrics-server-$DOWNLOAD_VERSION
tar -xzf metrics-server-$DOWNLOAD_VERSION.tar.gz --directory metrics-server-$DOWNLOAD_VERSION --strip-components 1
kubectl apply -f metrics-server-$DOWNLOAD_VERSION/deploy/1.8+/
```

3. Verify the metrics server is installed and running:

```
kubectl get deployment metrics-server -n kube-system
```

## Installation

This section describes installing the application on the kubernetes cluster.

- Setup Namespace

1. Create the production namespace

```
kubectl create namespace production
```

2. Verify namespace were created

```
kubectl get namespace -A
```

- Setup Persistent Volume Claims

1. Create the PVC for database and pub-sub deployments to use:

```
kubectl apply -f volumes/elastic-data-vol-claim.yaml
kubectl apply -f volumes/mongo-attendance-data-vol-claim.yaml
kubectl apply -f volumes/mongo-management-data-vol-claim.yaml
kubectl apply -f volumes/mongo-reporting-data-vol-claim.yaml
kubectl apply -f volumes/mongo-user-data-vol-claim.yaml
kubectl apply -f volumes/user-data-vol-claim.yaml
kubectl apply -f volumes/vault-data-vol-claim.yaml
```

2. Verify PVCs are created.

```
kubectl get persistentvolumeclaim --namespace production
```

**NOTE:** The PVCs may not be bound to a volume yet, which is fine.

- Deploying Databases and Application

1. Create configuration elements:

```
kubectl apply -f configmap\vault-config.yaml
```

2. Create deployments of databases and applications:

```
kubectl apply -f deployments/apm-deployment.yaml
kubectl apply -f deployments/elasticsearch-deployment.yaml
kubectl apply -f deployments/kibana-deployment.yaml
kubectl apply -f deployments/hexagon-deployment.yaml
kubectl apply -f deployments/mongo-attendance-deployment.yaml
kubectl apply -f deployments/mongo-management-deployment.yaml
kubectl apply -f deployments/mongo-reporting-deployment.yaml
kubectl apply -f deployments/mongo-user-deployment.yaml
kubectl apply -f deployments/vault-deployment.yaml
```

3. Verify deployments are created. It may take a couple of minutes for them to become available.

```
kubectl get deployments --namespace production
```

4. Verify PVCs are claimed by the deployments and are now bound:

```
kubectl get persistentvolumeclaim --namespace production
```

5. Create services to expose database and application deployments from the cluster:

```
kubectl apply -f services/apm-service.yaml
kubectl apply -f services/elasticsearch-service.yaml
kubectl apply -f services/kibana-service.yaml
kubectl apply -f services/hexagon-service.yaml
kubectl apply -f services/mongo-attendance-service.yaml
kubectl apply -f services/mongo-management-service.yaml
kubectl apply -f services/mongo-reporting-service.yaml
kubectl apply -f services/mongo-user-service.yaml
kubectl apply -f services/vault-service.yaml
```

6. Verify services are created and an external-ip is assigned for kibana and vault. Wait upto 5 minutes and access the services from the external-ip provisioned.

```
kubectl get svc --namespace production
```

- Deploying Vault Data

1. Copy the contents of the zip file provided offline into vault's volume:

```
kubectl cp -namespace production /local_path/vault/data <vault-pod-name>:/vault
```

- Deploying User Data

1. Copy the contents of the user-data-vol folder in the scripts/dev folder into user's volume:

```
kubectl cp -namespace production /local_path/scripts/user-data-vol <attendance-pod-name>:/app/resources/images
```

- Applying Horizontal Pod Autoscalers

1. Below steps provide steps for configuring auto-scaling of hexagon component:

   a. Create HorizontalPodAutoscaler(hpa) to allow the deployment to scale horizontally:

   ```
   kubectl apply -f autoscaler/hexagon-autoscaler.yaml
   ```

   b. Verify the hpa was configured successfully:

   ```
   kubectl describe hpa hexagon-autoscaler --namespace production
   ```

- Ingress Reverse Proxy

Once the backend services and deployments are created, create an ingress using nginx. The ingress serves as a reverse proxy for exposing the services with HTTPS.

1. Create the ingress resources:

```
kubectl apply -f ingress/initial-ingress.yaml
```

2. Expose the ingress service:

```
kubectl apply -f services/ingress-nginx.yaml
```

3. Verify the ingress service was created and an external ip-address was assigned.

```
kubectl get svc --namespace=production
```

4. Create resources for cert-manager, which will request for TLS certificates:

```
kubectl apply --validate=false -f certmanager/cert-manager.yaml
```

5. Verify cert-manager was successfully installed and has 3 pods running:

```
kubectl get pods --namespace cert-manager
```

6. Setup the cluster-issuer which will be used by cert-manager to request for TLS certificates:

```
kubectl apply -f clusterissuer/letsencrypt-prod.yaml
```

**NOTE:** Before the next step is performed, ensure network setup is correctly done and the DNS records for the sub-domains listed are accessible.

7. Create the ingress resource which provides the proxy mappings of backend services:

```
kubectl apply -f ingress/resources-ingress.yaml
```

8. Verify and track resources were created successfully:

```
kubectl describe ingress --namespace production
kubectl describe secrets nginx-tls --namespace production
kubectl describe certificate --namespace production
```

**Explanation:**

1. Once the ingress resource is applied, cert-manager detects a TLS certificate request made by this resource, and requests for certificates to be issued through the clusterissuer from the certifying authority. Once certificates are issued, the certificates are mounted by cert-manager as secrets. These secrets are available for the ingress deployment's use, which detects these secrets and reloads itself, in order to bind the certificates.

2. cert-manager will automatically request for new certificates when existing certificates are due to expire and update the secrets. No manual intervention is needed.

## Network Setup

Post installation of resources in eks, hostnames need to be mapped to DNS services for them to be resolved over the internet.

For the following hostnames, add CNAME entries with the external ip-address generated in **Ingress Reverse Proxy Setup Step 3** in [AWS Route53](https://aws.amazon.com/route53/)

All hostnames need to be mapped to the same external ip-address.

The ingress resource mapping will be used to route traffic to the appropriate backend resources based on the request received.

- attendance.upresent.ga
- management.upresent.ga
- reporting.upresent.ga
- user.upresent.ga
